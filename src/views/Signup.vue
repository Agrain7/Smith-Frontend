<template>
  <div class="signup-page">
    <div class="signup-container">
      <!-- 로고 이미지 -->
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      
      <!-- 제목: 작고 왼쪽 정렬 -->
      <h2 class="title">회원정보를 입력해주세요.</h2>
      
      <!-- 회원가입 폼 -->
      <form @submit.prevent="signup">
        <!-- 아이디 입력 -->
        <div class="form-group">
          <input
            type="text"
            v-model="form.username"
            placeholder="아이디"
            required
          />
        </div>

        <!-- 비밀번호 입력 -->
        <div class="form-group">
          <input
            type="password"
            v-model="form.password"
            placeholder="비밀번호"
            required
          />
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-group">
          <input
            type="password"
            v-model="form.passwordConfirm"
            placeholder="비밀번호 확인"
            required
          />
        </div>

        <!-- 이름 입력 -->
        <div class="form-group">
          <input
            type="text"
            v-model="form.name"
            placeholder="이름"
            required
          />
        </div>

        <!-- 휴대폰번호 입력 -->
        <div class="form-group">
          <input
            type="tel"
            v-model="form.phone"
            placeholder="휴대폰번호"
            required
          />
        </div>

        <!-- 체크박스 -->
        <div class="checkbox-row">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.agree" />
            모두 확인하였으며 동의합니다.
          </label>
        </div>

        <!-- 약관창 -->
        <div class="terms-container">
          <h3>약관</h3>
          <div class="terms-content">
            <p>
              여기에 약관 내용이 표시됩니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        <!-- 가입 버튼 -->
        <div class="button-group">
          <button type="submit" class="signup-button" :disabled="!form.agree">
            동의하고 가입하기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Signup",
  data() {
    return {
      form: {
        username: "",
        password: "",
        passwordConfirm: "",
        name: "",
        phone: "",
        agree: false,
      },
    };
  },
  methods: {
    async signup() {
      if (this.form.password !== this.form.passwordConfirm) {
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
      }
      try {
        // 백엔드의 회원가입 API 호출
        const response = await fetch("http://localhost:5000/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.form.username,
            password: this.form.password,
            name: this.form.name,
            phone: this.form.phone,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("회원가입 성공:", data);
          alert("회원가입이 완료되었습니다.");
          this.$router.push("/login");
        } else {
          alert(data.message || "회원가입 실패");
        }
      } catch (error) {
        console.error("회원가입 에러:", error);
        alert("서버와 통신 중 오류 발생");
      }
    },
  },
};
</script>
  
  <style scoped>
  .signup-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: transparent;
  }
  
  .signup-container {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }
  
  .logo {
    display: block;
    max-width: 200px;
    margin: 0 auto 20px;
  }
  
  .title {
    font-size: 16px;
    font-weight: normal;
    text-align: left;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
  }
  
  /* 체크박스 행 */
  .checkbox-row {
    text-align: left;
    margin-bottom: 15px;
  }
  
  .checkbox-label {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  
  .checkbox-label input {
    margin-right: 5px;
  }
  
  /* 약관창 */
  .terms-container {
    text-align: left;
    margin-top: 20px;
  }
  
  .terms-container h3 {
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: bold;
  }
  
  .terms-content {
    height: 100px;
    overflow-y: scroll;
    border: 1px solid #ccc;
    padding: 10px;
    font-size: 12px;
    color: #555;
    background-color: #f9f9f9;
    box-sizing: border-box;
  }
  
  /* 가입 버튼 행 */
  .button-group {
    margin-top: 20px;
  }
  
  .signup-button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .signup-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .signup-button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  </style>
  