<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="product-type">
        부재종류: {{ productType }}
      </div>
      <h2>견적 요청 제출</h2>
      <form @submit.prevent="submitEstimate">
        <!-- 프로젝트명 입력 -->
        <div class="form-group">
          <label>프로젝트명:</label>
          <input type="text" v-model="localProjectName" placeholder="프로젝트명을 입력하세요" required />
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
    // v-model을 위해 modelValue prop 사용
    modelValue: {
      type: String,
      default: ''
    },
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localProjectName: this.modelValue, // 부모와 동기화할 로컬 변수
      form: {
        file: null
      },
      uploadProgress: 0
    };
  },
  computed: {
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
      formData.append('projectName', this.localProjectName);
      formData.append('productType', this.productType);

      try {
        const uploadResponse = await axios.post(`${apiUrl}/api/upload-estimate`, formData, {
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.uploadProgress = percentCompleted;
          }
        });
        const data = uploadResponse.data;
        if (data.success) {
          const payload = {
            username: this.userData.username,
            name: this.userData.name,
            phone: this.userData.phone,
            projectName: this.localProjectName,
            productType: this.productType,
            fileUrl: data.fileUrl,
            fileName: data.fileName
          };
          const estimateRes = await axios.post(`${apiUrl}/api/estimate-request`, payload, {
            headers: { 'Content-Type': 'application/json' }
          });
          const estimateData = estimateRes.data;
          if (estimateData.success) {
            alert("견적 요청이 제출되었습니다.");
            // v-model 업데이트: 부모에 새 프로젝트명을 전달
            this.$emit('update:modelValue', this.localProjectName);
            this.close();
          } else {
            alert(estimateData.message || "견적 요청 제출에 실패했습니다.");
          }
        } else {
          alert(data.message || "파일 업로드에 실패했습니다.");
        }
      } catch (err) {
        console.error("파일 업로드 오류:", err);
        alert("파일 업로드 중 오류 발생");
      }
    }
  },
  watch: {
    modelValue(newVal) {
      this.localProjectName = newVal;
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
