<template>
  <nav class="top-nav-bar">
    <ul>
      <!-- 로그인 상태이면 사용자명을 표시 -->
      <li v-if="isLoggedIn">
        <span>{{ userName }}님</span>
      </li>
      <!-- 로그인 상태가 아니라면 로그인/회원가입 링크 표시 -->
      <li v-if="!isLoggedIn">
        <router-link to="/login">로그인</router-link>
      </li>
      <li v-if="!isLoggedIn">
        <router-link to="/signup">회원가입</router-link>
      </li>
      <!-- 로그인 상태이면 로그아웃 링크 표시 -->
      <li v-if="isLoggedIn">
        <a href="#" @click.prevent="logout">로그아웃</a>
      </li>
      <li>
        <a href="#">고객센터</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    // token에서 사용자명을 추출하는 computed property
    userName() {
      const token = this.$store.state.token;
      if (!token) {
        return '';
      }
      try {
        // JWT 토큰은 header.payload.signature 구조입니다.
        const payload = token.split('.')[1];
        // Base64로 인코딩된 payload를 디코딩
        const decodedPayload = JSON.parse(atob(payload));
        // 토큰 생성 시 { username: user.username }로 생성되었다면 username을 사용
        return decodedPayload.username || '';
      } catch (error) {
        console.error("토큰 파싱 에러:", error);
        return '';
      }
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.top-nav-bar {
  width: 1080px;
  margin: 0 auto;
  padding: 5px 20px;
  box-sizing: border-box;
}
.top-nav-bar ul {
  display: flex;
  justify-content: flex-end;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}
.top-nav-bar li a,
.top-nav-bar li span {
  text-decoration: none;
  font-size: 10px;
  color: #333;
  transition: color 0.3s;
}
.top-nav-bar li a:hover {
  color: #0078d7;
}
</style>
