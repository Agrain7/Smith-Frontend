<!-- frontend/src/components/NavBar.vue -->

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
      <!-- 관리자인 경우 "관리자 페이지" 버튼, 아닌 경우 "고객센터" 버튼 -->
      <li v-if="isAdmin">
        <router-link to="/admin">관리자 페이지</router-link>
      </li>
      <li v-else>
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
    userName() {
      const token = this.$store.state.token || localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return '';
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payload))));
        return decoded.name || '';
      } catch (error) {
        console.error("토큰 파싱 에러:", error);
        return '';
      }
    },
    isAdmin() {
      const token = this.$store.state.token || localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return false;
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payload))));
        return decoded.isAdmin === true;
      } catch (error) {
        console.error("토큰 파싱 에러:", error);
        return false;
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
  width: 100%;
  max-width: 1080px;
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
