<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
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
          <!-- 파일 업로드 -->
          <div class="form-group">
            <label>견적서 파일 (TXT만 가능):</label>
            <input type="file" ref="fileInput" @change="handleFileChange" accept=".txt" required />
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
  import emailjs from 'emailjs-com';
  
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
    methods: {
      close() {
        this.$emit('close');
      },
      handleFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
          this.form.file = file;
        } else {
          alert('TXT 파일만 선택 가능합니다.');
          this.$refs.fileInput.value = null;
        }
      },
      submitEstimate() {
        if (!this.form.file) {
          alert('견적서 파일을 선택하세요.');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const textContent = reader.result;
          // EmailJS 전송
          const templateParams = {
            to_email: this.form.email,      
            username: this.form.username,    
            name: this.form.name,            
            phone: this.form.phone,          
            projectName: this.form.projectName, 
            email: this.form.email,          
            file_content: textContent,       
            filename: this.form.file.name    
          };
          emailjs.send('service_ut6rmkh', 'template_f7rf82t', templateParams, 'umd5YAQiBuxttvCy2')
            .then(response => {
              alert(`Email 전송 성공: ${this.form.file.name}`);
              // 백엔드로 견적 요청 정보 전송
              this.sendEstimateToBackend(textContent);
            })
            .catch(error => {
              console.error('Email 전송 실패:', error);
              alert('Email 전송에 실패하였습니다.');
            });
        };
        reader.readAsText(this.form.file);
      },
      sendEstimateToBackend(fileContent) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // POST 요청으로 견적 요청 정보를 백엔드에 전송
        const payload = {
          username: this.form.username,
          name: this.form.name,
          phone: this.form.phone,
          email: this.form.email,
          projectName: this.form.projectName,
          fileContent: fileContent,
          fileName: this.form.file.name
        };
        fetch(`${apiUrl}/api/estimate-request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("견적 요청이 백엔드에 성공적으로 전송되었습니다.");
            this.close();
          } else {
            alert(data.message || "백엔드 전송에 실패했습니다.");
          }
        })
        .catch(err => {
          console.error("백엔드 전송 오류:", err);
          alert("백엔드 전송 중 오류 발생");
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
  