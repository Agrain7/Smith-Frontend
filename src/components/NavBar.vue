<template>
  <nav class="top-nav-bar">
    <ul>
      <li v-if="!isLoggedIn">
        <router-link to="/login">로그인</router-link>
      </li>
      <li v-if="!isLoggedIn">
        <router-link to="/signup">회원가입</router-link>
      </li>
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
/* 기존 스타일 유지 */
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
.top-nav-bar li a {
  text-decoration: none;
  font-size: 10px;         
  color: #333;
  transition: color 0.3s;
}
.top-nav-bar li a:hover {
  color: #0078d7;
}
</style>
