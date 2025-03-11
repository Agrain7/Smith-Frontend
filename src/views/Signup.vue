<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Smith 로고" />
      </div>
      <h2>회원가입</h2>

      <!-- 회원가입 폼 -->
      <form @submit.prevent="signup">
        <div class="input-group">
          <label for="name">이름</label>
          <input type="text" id="name" v-model="form.name" placeholder="이름을 입력하세요" required />
        </div>

        <div class="input-group">
          <label for="username">아이디</label>
          <input type="text" id="username" v-model="form.username" placeholder="아이디를 입력하세요" required />
        </div>

        <div class="input-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="form.password" placeholder="비밀번호를 입력하세요" required />
        </div>

        <div class="input-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input type="password" id="confirmPassword" v-model="form.passwordConfirm" placeholder="비밀번호를 다시 입력하세요" required />
        </div>

        <div class="input-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="form.email" placeholder="이메일을 입력하세요" required />
        </div>

        <div class="input-group">
          <label for="phone">휴대폰 번호</label>
          <input type="tel" id="phone" v-model="form.phone" placeholder="휴대폰 번호를 입력하세요" required />
        </div>

        <!-- 약관 동의 -->
        <div class="terms-container">
          <label class="terms-title">약관</label>
          <div class="terms-box">
            <p><strong>제1조 (목적)</strong><br> 이 약관은 (주)이 필(이하 “회사”라 함)이 제공하는 온라인 서비스(이하 “서비스”라 함)를 이용함에 있어 회사와 이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            <p><strong>제2조 (약관의 효력 및 변경)</strong><br> 1. 본 약관은 회원이 서비스에 가입할 때 “동의함” 버튼을 클릭함으로써 효력이 발생합니다.<br> 2. 회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 개정할 수 있으며, 약관이 개정될 경우 서비스 내 공지사항 또는 회원 이메일을 통해 통지합니다.</p>
          </div>

          <div class="agree-box">
            <input type="checkbox" id="agree" v-model="form.agree" />
            <label for="agree">모두 확인하였으며 동의합니다.</label>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="button-container">
          <button type="submit" class="btn-signup" :disabled="!form.agree">회원가입</button>
          <button type="button" class="btn-cancel" @click="cancelSignup">취소</button>
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
        email: "",
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
        // 환경변수에서 백엔드 URL 가져오기 (Vite의 경우)
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.form.username,
            password: this.form.password,
            name: this.form.name,
            phone: this.form.phone,
            email: this.form.email,
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
    cancelSignup() {
      this.$router.push("/login"); // 로그인 페이지로 이동
    }
  }
};
</script>

<style scoped>
/* ===== 회원가입 페이지 전체 스타일 ===== */
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
  background-color: #f5f5f5;
  margin: 0;
}

.logo img {
  width: 180px;
  display: block;
  margin: 0 auto 25px;
}

/* ===== 회원가입 컨테이너 ===== */
.signup-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 420px;
  text-align: center;
}

/* ===== 입력 필드 스타일 ===== */
.input-group {
  margin-top: 10px;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
}

input {
  width: calc(100% - 20px);
  padding: 14px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  display: block;
  margin: 0 auto;
}

/* ===== 약관 동의 스타일 ===== */
.terms-container {
  margin-top: 20px;
  text-align: left;
}

.terms-box {
  width: calc(100% - 20px);
  height: 150px;
  overflow-y: scroll;
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 14px;
  background: #f9f9f9;
  margin: 0 auto;
}

.agree-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  padding-left: 5px;
  margin-top: 5px;
}

.agree-box input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

/* ===== 버튼 스타일 ===== */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-signup,
.btn-cancel {
  padding: 14px;
  border-radius: 8px;
  width: 48%;
  font-size: 16px;
  font-weight: bold;
}

/* ===== 비활성화된 버튼 스타일 ===== */
.btn-signup:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
