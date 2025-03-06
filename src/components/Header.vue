<!-- frontend/src/components/Header.vue -->
<template>
  <header class="header-container">
    <div class="header-top">
      <div class="left-section">
        <router-link to="/">
          <img src="@/assets/logo.png" alt="로고" class="logo" />
        </router-link>
      </div>
      <div class="center-section">
        <!-- 중앙 영역은 비워둡니다 -->
      </div>
      <div class="right-section">
        <button class="cart-btn" @click="handleBasket">
          <img src="@/assets/cart-icon.png" alt="장바구니 아이콘" class="icon" />
          <span class="btn-text">구매내역</span>
        </button>
        <button class="mypage-btn" @click="handleMypage">
          <img src="@/assets/mypage-icon.png" alt="마이페이지 아이콘" class="icon" />
          <span class="btn-text">마이페이지</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    handleMypage() {
      if (this.isLoggedIn) {
        this.$router.push("/mypage");
      } else {
        this.$router.push("/login");
      }
    },
    handleBasket() {
      if (this.isLoggedIn) {
        this.$router.push("/basket");
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
.header-container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #fff;
  padding: 10px 20px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section {
  flex: 0 0 auto;
}

.logo {
  height: 40px;
}

.center-section {
  flex: 1 1 auto;
}

.right-section {
  flex: 0 0 auto;
  display: flex;
  gap: 10px;
}

.cart-btn,
.mypage-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #333;
}

.icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.btn-text {
  /* 텍스트 스타일 조정 */
  font-weight: bold;
}
</style>
