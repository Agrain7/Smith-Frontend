<!-- [frontend] /src/App.vue -->

<template>
  <div id="app" :class="responsiveClass">
    <!-- Header (네비게이션) : 로그인 및 회원가입 페이지가 아닐 때만 NavBar 표시 -->
    <NavBarComponent v-if="shouldShowNavBar" />

    <!-- 페이지 렌더링 영역 -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBarComponent from "./components/NavBarComponent.vue";

export default {
  name: "App",
  components: {
    NavBarComponent
  },
  data() {
    return {
      isMobile: window.innerWidth < 768
    };
  },
  computed: {
    responsiveClass() {
      return this.isMobile ? "mobile-style" : "desktop-style";
    },
    shouldShowNavBar() {
      return !["/login", "/signup"].includes(this.$route.path);
    }
  },
  methods: {
    updateScreenSize() {
      this.isMobile = window.innerWidth < 768;
    }
  },
  mounted() {
    window.addEventListener("resize", this.updateScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateScreenSize);
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
.desktop-style {
  max-width: 1912px;
  margin: auto;
}
.mobile-style {
  width: 100%;
  padding: 10px;
}
</style>
