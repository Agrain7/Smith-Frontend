<template>
  <header class="header-container">
    <!-- 상단 영역: 한 행에 모든 요소 배치 -->
    <div class="header-top">
      <!-- 왼쪽 영역: 카테고리 버튼(드롭다운 포함) 및 로고 -->
      <div class="left-section">
        <div class="category-container">
          <button class="category-btn">
            <img src="@/assets/category-icon.png" alt="카테고리 아이콘" class="icon" />
            카테고리
          </button>
          <!-- 드롭다운 메뉴 -->
          <div class="dropdown-menu">
            <ul>
              <li>
                <router-link :to="`/product/${encodeURIComponent('현장용소부재')}`">현장용소부재</router-link>
              </li>
              <li>
                <router-link :to="`/product/${encodeURIComponent('공장용소부재')}`">공장용소부재</router-link>
              </li>
              <li>
                <router-link :to="`/product/${encodeURIComponent('철판')}`">철판</router-link>
              </li>
              <li>
                <router-link :to="`/product/${encodeURIComponent('브라켓')}`">브라켓</router-link>
              </li>
              <li>
                <router-link :to="`/product/${encodeURIComponent('볼트')}`">볼트</router-link>
              </li>
              <li>
                <router-link :to="`/product/${encodeURIComponent('야')}`">야</router-link>
              </li>
            </ul>
          </div>
        </div>
        <!-- 로고 이미지 클릭 시 홈으로 이동 -->
        <router-link to="/">
          <img src="@/assets/logo.png" alt="로고" class="logo" />
        </router-link>
      </div>

      <!-- 중앙 영역: 검색창 -->
      <div class="center-section">
        <div class="search-container">
          <input type="text" placeholder="검색어를 입력하세요" class="search-input" />
          <img src="@/assets/search-icon.png" alt="검색" class="search-icon" />
        </div>
      </div>

      <!-- 오른쪽 영역: 장바구니, 마이페이지 버튼 -->
      <div class="right-section">
        <button class="cart-btn" @click="handleBasket">
          <img src="@/assets/cart-icon.png" alt="장바구니 아이콘" class="icon" />
          장바구니
        </button>
        <button class="mypage-btn" @click="handleMypage">
          <img src="@/assets/mypage-icon.png" alt="마이페이지 아이콘" class="icon" />
          마이페이지
        </button>
      </div>
    </div>

    <!-- 하단 영역: 네비게이션 바 -->
    <div class="header-bottom">
      <nav class="sub-nav">
        <ul>
          <li>
            <router-link :to="`/product/${encodeURIComponent('현장용소부재')}`">현장용소부재</router-link>
          </li>
          <li>
            <router-link :to="`/product/${encodeURIComponent('공장용소부재')}`">공장용소부재</router-link>
          </li>
          <li>
            <router-link :to="`/product/${encodeURIComponent('철판')}`">철판</router-link>
          </li>
          <li>
            <router-link :to="`/product/${encodeURIComponent('브라켓')}`">브라켓</router-link>
          </li>
          <li>
            <router-link :to="`/product/${encodeURIComponent('볼트')}`">볼트</router-link>
          </li>
          <li>
            <router-link :to="`/product/${encodeURIComponent('야')}`">야</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  computed: {
    // Vuex를 통해 로그인 상태를 확인 (Vuex 스토어의 isLoggedIn 게터 사용)
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
/* 전체 헤더 컨테이너: 1080px 고정 및 중앙 정렬 */
.header-container {
  width: 1080px;
  margin: 0 auto;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}

/* 상단 영역 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

/* 왼쪽 영역: 카테고리 버튼 및 로고 */
.left-section {
  display: flex;
  align-items: center;
}

.category-container {
  position: relative;
}

.category-btn {
  background-color: #007bff;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  display: none;
  z-index: 100;
  min-width: 150px;
}

.category-container:hover .dropdown-menu {
  display: block;
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  margin-bottom: 5px;
}

.dropdown-menu li a {
  text-decoration: none;
  color: #333;
  display: block;
  padding: 5px;
}

.dropdown-menu li a:hover {
  background-color: #f0f0f0;
}

.logo {
  height: 40px;
  margin-left: 10px;
}

/* 중앙 영역: 검색창 */
.center-section {
  flex: 1;
  margin: 0 20px;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 8px 40px 8px 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* 오른쪽 영역: 장바구니, 마이페이지 버튼 */
.right-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-btn,
.mypage-btn {
  background-color: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: inherit;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
}

/* 하단 영역: 네비게이션 바 */
.header-bottom {
  padding: 0 40px;
}

.sub-nav {
  width: 500px; /* 검색창과 동일한 너비 */
  margin-left: 230px;
  box-sizing: border-box;
}

.sub-nav ul {
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
}

.sub-nav li a {
  text-decoration: none;
  font-size: 12px;
  color: #333;
  transition: color 0.3s;
}

.sub-nav li a:hover {
  color: #0078d7;
}
</style>
