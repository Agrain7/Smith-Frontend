<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <!-- 부재종류 표시 (현재 라우트의 productId 사용) -->
      <div class="product-type">
        부재종류: {{ productType }}
      </div>
      <h2>견적 요청 제출</h2>
      <form @submit.prevent="submitEstimate">
        <!-- 프로젝트명 입력 -->
        <div class="form-group">
          <label>프로젝트명:</label>
          <input type="text" v-model="form.projectName" placeholder="프로젝트명을 입력하세요" required />
        </div>
        <!-- 파일 업로드 (모든 파일 허용) -->
        <div class="form-group">
          <label>견적요청 파일:</label>
          <input type="file" ref="fileInput" @change="handleFileChange" required />
        </div>
        <!-- 업로드 진행률 표시 -->
        <div class="progress" v-if="uploadProgress > 0">
          업로드 진행률: {{ uploadProgress }}%
          <progress :value="uploadProgress" max="100"></progress>
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
import axios from 'axios';

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
        projectName: '',
        file: null
      },
      uploadProgress: 0  // 업로드 진행률 (%)
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
    async submitEstimate() {
      if (!this.form.file) {
        alert('파일을 선택하세요.');
        return;
      }
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const formData = new FormData();
      formData.append('estimateFile', this.form.file);
      formData.append('projectName', this.form.projectName);
      formData.append('productType', this.productType);

      try {
        // 파일 업로드 (Axios로 진행률 추적)
        const uploadResponse = await axios.post(`${apiUrl}/api/upload-estimate`, formData, {
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.uploadProgress = percentCompleted;
          }
        });
        const uploadData = uploadResponse.data;
        if (!uploadData.success) {
          alert(uploadData.message || "파일 업로드에 실패했습니다.");
          return;
        }
        // 견적 요청 제출 (파일 업로드 후)
        const estimatePayload = {
          username: this.userData.username,
          name: this.userData.name,
          phone: this.userData.phone,
          projectName: this.form.projectName,
          productType: this.productType,
          fileUrl: uploadData.fileUrl,
          fileName: uploadData.fileName
        };
        const estimateRes = await axios.post(`${apiUrl}/api/estimate-request`, estimatePayload, {
          headers: { 'Content-Type': 'application/json' }
        });
        const estimateData = estimateRes.data;
        if (!estimateData.success) {
          alert(estimateData.message || "견적 요청 제출에 실패했습니다.");
          return;
        }
        // 주문 데이터도 함께 전송 (동일한 정보로 orders 엔드포인트 호출)
        const orderPayload = {
          username: this.userData.username,
          productName: this.productType, // 라우트의 productId를 제품명으로 사용
          projectName: this.form.projectName,
          orderDetails: {
            fileUrl: uploadData.fileUrl,
            fileName: uploadData.fileName
          },
          status: "견적 요청 전송 완료"
        };
        const orderRes = await axios.post(`${apiUrl}/api/orders`, orderPayload, {
          headers: { 'Content-Type': 'application/json' }
        });
        const orderData = orderRes.data;
        if (orderData.success) {
          alert("견적 요청이 제출되었습니다.");
          this.close();
        } else {
          alert(orderData.message || "주문 데이터 전송에 실패했습니다.");
        }
      } catch (err) {
        console.error("파일 업로드 또는 주문 전송 오류:", err);
        alert("전송 중 오류 발생");
      }
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
h2 {
  margin-bottom: 20px;
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
.progress {
  margin-bottom: 15px;
}
progress {
  width: 100%;
  height: 20px;
}
</style>
