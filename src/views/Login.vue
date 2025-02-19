<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 로고 이미지 -->
      <img src="@/assets/logo.png" alt="Logo" class="logo" />

      <!-- 로그인 폼 -->
      <form @submit.prevent="login">
        <!-- 아이디 입력 -->
        <div class="form-group">
          <label for="username">아이디</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="아이디를 입력하세요"
            required
          />
        </div>

        <!-- 비밀번호 입력 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <!-- 자동로그인 체크박스 -->
        <div class="form-group auto-login">
          <label>
            <input type="checkbox" v-model="autoLogin" />
            자동로그인
          </label>
        </div>

        <!-- 로그인, 회원가입 버튼 그룹 -->
        <div class="button-group">
          <button type="submit" class="login-button">로그인</button>
          <button type="button" class="signup-button" @click="goToSignup">
            회원가입
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      // password: "",
      autoLogin: false, // 체크박스 상태 (자동로그인 여부)
    };
  },
  methods: {
    async login() {
      // Vuex의 login 액션에 autoLogin 값도 함께 전달
      const result = await this.$store.dispatch("login", {
        username: this.username,
        password: this.password,
        autoLogin: this.autoLogin,
      });
      if (result.success) {
        console.log("로그인 성공");
        // 로그인 성공 후 원하는 페이지로 이동
        this.$router.push("/");
      } else {
        alert(result.message || "로그인 실패");
      }
    },
    goToSignup() {
      this.$router.push("/signup");
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  text-align: center;
}

.logo {
  max-width: 200px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.auto-login {
  text-align: left;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.login-button,
.signup-button {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button {
  background-color: #007bff;
  color: #fff;
}

.login-button:hover {
  background-color: #0056b3;
}

.signup-button {
  background-color: #fff;
  color: #007bff;
  border: 2px solid #007bff;
}

.signup-button:hover {
  background-color: #e6f0ff;
}
</style>
