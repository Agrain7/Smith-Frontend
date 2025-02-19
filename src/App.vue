<template>
  <div id="app">
    <!-- minimalLayout이 true인 경우(구매창)에는 NavBar와 Header를 숨깁니다 -->
    <NavBar v-if="!$route.meta.minimalLayout" />
    <Header v-if="!$route.meta.minimalLayout" />
    <!-- Banner는 minimalLayout이 아닐 때만 표시하고, hideBanner가 true면 숨깁니다 -->
    <Banner v-if="!$route.meta.minimalLayout && !$route.meta.hideBanner" />
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Header from "./components/Header.vue";
import Banner from "./components/Banner.vue";

export default {
  name: "App",
  components: {
    NavBar,
    Header,
    Banner,
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
