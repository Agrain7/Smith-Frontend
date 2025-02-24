<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <!-- 부재종류 표시 (현재 라우트의 productId 사용) -->
      <div class="product-type">
        부재종류: {{ productType }}
      </div>
      <h2>견적 요청 제출</h2>
      <form @submit.prevent="submitEstimate">
        <!-- 로그인한 사용자 정보 (수정 가능) -->
        <div class="form-group">
          <label>아이디:</label>
          <input type="text" v-model="form.username" readonly />
        </div>
        <div class="form-group">
          <label>이름:</label>
          <input type="text" v-model="form.name" />
        </div>
        <div class="form-group">
          <label>전화번호:</label>
          <input type="text" v-model="form.phone" />
        </div>
        <!-- 프로젝트명 및 이메일 입력 -->
        <div class="form-group">
          <label>프로젝트명:</label>
          <input type="text" v-model="form.projectName" placeholder="프로젝트명을 입력하세요" required />
        </div>
        <div class="form-group">
          <label>이메일 주소:</label>
          <input type="email" v-model="form.email" placeholder="이메일을 입력하세요" required />
        </div>
        <!-- 파일 업로드 (모든 파일 허용) -->
        <div class="form-group">
          <label>견적요청 파일:</label>
          <input type="file" ref="fileInput" @change="handleFileChange" required />
        </div>
        <!-- 버튼 그룹 -->
        <div class="button-group">
          <button type="submit">전송</button>
          <button type="button" @click="close">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EstimateRequestModal',
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        username: this.userData.username || '',
        name: this.userData.name || '',
        phone: this.userData.phone || '',
        projectName: '',
        email: this.userData.email || '',
        file: null
      }
    };
  },
  computed: {
    // 현재 라우트 파라미터에서 부재종류(제품명)를 가져옵니다.
    productType() {
      return this.$route.params.productId || '';
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.file = file;
      } else {
        alert('파일을 선택하세요.');
        this.$refs.fileInput.value = null;
      }
    },
    submitEstimate() {
      if (!this.form.file) {
        alert('파일을 선택하세요.');
        return;
      }
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // FormData 객체 생성하여 파일 및 기타 폼 데이터를 함께 전송
      const formData = new FormData();
      formData.append('estimateFile', this.form.file);
      formData.append('username', this.form.username);
      formData.append('name', this.form.name);
      formData.append('phone', this.form.phone);
      formData.append('email', this.form.email);
      formData.append('projectName', this.form.projectName);
      formData.append('productType', this.productType);
      
      fetch(`${apiUrl}/api/upload-estimate`, {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("파일 업로드 성공!");
            // 파일 업로드가 성공하면, 백엔드에 견적 요청 정보를 저장하는 POST 요청을 추가합니다.
            const payload = {
              username: this.form.username,
              name: this.form.name,
              phone: this.form.phone,
              email: this.form.email,
              projectName: this.form.projectName,
              productType: this.productType,
              fileUrl: data.fileUrl,    // 업로드 응답으로 받은 파일 URL
              fileName: data.fileName   // 업로드 응답으로 받은 원본 파일명
            };
            fetch(`${apiUrl}/api/estimate-request`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            })
              .then(res2 => res2.json())
              .then(result => {
                if (result.success) {
                  alert("견적 요청이 제출되었습니다.");
                  this.close();
                } else {
                  alert(result.message || "견적 요청 제출에 실패했습니다.");
                }
              })
              .catch(err => {
                console.error("견적 요청 제출 오류:", err);
                alert("견적 요청 제출 중 오류 발생");
              });
          } else {
            alert(data.message || "파일 업로드에 실패했습니다.");
          }
        })
        .catch(err => {
          console.error("파일 업로드 오류:", err);
          alert("파일 업로드 중 오류 발생");
        });
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background-color: #fff;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  border-radius: 8px;
}
.product-type {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.button-group button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.button-group button[type="submit"] {
  background-color: #007bff;
  color: #fff;
}
.button-group button[type="button"] {
  background-color: #ccc;
}
</style>
