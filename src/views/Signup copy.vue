<!-- frontend/src/views/Signup.vue -->
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
            <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: inherit; border: none; padding: 0; margin: 0;">
제1조 (목적)
이 약관은 (주)이 필(이하 “회사”라 함)이 제공하는 온라인 서비스(이하 “서비스”라 함)를 이용함에 있어 회사와 이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (약관의 효력 및 변경)
1. 본 약관은 회원이 서비스에 가입할 때 “동의함” 버튼을 클릭함으로써 효력이 발생합니다.
2. 회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 개정할 수 있으며, 약관이 개정될 경우 서비스 내 공지사항 또는 회원 이메일을 통해 통지합니다.

제3조 (회원가입)
1. 회원가입은 본 약관의 내용에 동의한 후 회사가 정한 가입 양식에 따라 신청하여 승인을 받음으로써 완료됩니다.
2. 회사는 다음 각 호의 경우 회원가입 신청을 거부하거나 취소할 수 있습니다.
   - 타인의 명의를 도용한 경우
   - 허위의 정보를 기재한 경우
   - 기타 회사가 정한 회원가입 요건에 미비된 경우

제4조 (개인정보의 수집 및 이용)
1. 회사는 회원가입 시 필요한 최소한의 개인정보(예: 이름, 이메일, 휴대전화번호 등)를 수집합니다.
2. 수집된 개인정보는 회원 식별, 서비스 제공, 본인확인, 회원 관리 등을 위해 사용되며, 관련 법령에 따라 안전하게 관리됩니다.
3. 회원은 언제든지 개인정보 제공에 동의 철회 및 열람, 수정, 삭제를 요청할 수 있습니다.

제5조 (회원의 의무)
1. 회원은 본 약관 및 관련 법령을 준수하여야 하며, 기타 회사의 업무에 방해가 되는 행위를 해서는 안 됩니다.
2. 회원은 자신의 아이디 및 비밀번호를 안전하게 관리할 책임이 있으며, 이를 타인에게 이용하게 해서는 안 됩니다.

제6조 (서비스 이용)
1. 회사는 회원에게 다음과 같은 서비스를 제공합니다.
   - 회원 정보 관리
   - 기타 회사가 정하는 온라인 서비스
2. 서비스 이용 중 발생하는 문제에 대해 회사는 관련 법령에 따라 책임을 집니다.

제7조 (면책조항)
1. 회사는 천재지변, 전쟁, 기타 불가항력적인 사유로 인한 서비스 제공의 지연 또는 중단에 대하여 책임을 지지 않습니다.
2. 회사는 회원 상호간 또는 회원과 제3자 간에 서비스를 매개로 발생한 분쟁에 대해서는 책임을 지지 않습니다.

제8조 (분쟁의 해결)
본 약관과 관련하여 발생한 분쟁은 회사의 본사 소재지를 관할하는 법원을 제1심 관할 법원으로 합니다.
            </pre>
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
  width: 100%;
  max-width: 400px;
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
  height: 200px;
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
