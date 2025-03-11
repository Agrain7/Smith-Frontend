<!-- [frontend] /src/components/NavBarComponent.vue -->
<template>
    <header class="header-container">
      <!-- 네비게이션 바 -->
      <nav class="navbar-content">
        <!-- 로고 -->
        <div class="navbar-logo">
          <router-link to="/">
            <img src="@/assets/logo.png" alt="로고" class="logo" />
          </router-link>
        </div>

        <!-- 네비게이션 메뉴 -->
        <ul class="navbar-menu">
          <li v-if="!isLoggedIn"><router-link to="/login" class="nav-btn highlight">로그인</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/signup" class="nav-btn highlight">회원가입</router-link></li>
          <li v-if="isLoggedIn"><span>{{ userName }}님</span></li>
          <li v-if="isLoggedIn"><router-link to="/mypage" class="nav-btn">마이페이지</router-link></li>
          <!-- <li v-if="isLoggedIn"><router-link to="/basket" class="nav-btn">구매내역</router-link></li> -->
          <li v-if="isLoggedIn"><a href="#" @click.prevent="logout" class="nav-btn logout">로그아웃</a></li>
          <li v-if="isAdmin"><router-link to="/admin" class="nav-btn">관리자 페이지</router-link></li>
        </ul>
      </nav>
    </header>
</template>
  
<script>
  export default {
    name: "NavBarComponent",
    computed: {
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      },
      userName() {
        const token = this.$store.state.token || localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return "";
        try {
          const payload = token.split(".")[1];
          const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payload))));
          return decoded.name || "";
        } catch (error) {
          console.error("토큰 파싱 에러:", error);
          return "";
        }
      },
      isAdmin() {
        const token = this.$store.state.token || localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return false;
        try {
          const payload = token.split(".")[1];
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
        this.$store.dispatch("logout");
        this.$router.push("/login");
      }
    },
  };
</script>
  
<style scoped>
  /* 네비게이션 바 전체 스타일 */
  .header-container {
    width: 100%;
    max-width: 1912px;
    margin: 0 auto;
    padding: 10px 20px;
    background-color: #fff;
    font-family: "Noto Sans KR", sans-serif;
    border-bottom: 2px solid #ddd;
    justify-content: space-between;
    align-items: center;
  }

  /* 네비게이션 바 */
  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  /* 로고 */
  .navbar-logo {
    flex: 0 0 auto;
  }
  .navbar-logo .logo {
    height: 50px;
  }

  /* 네비게이션 메뉴 */
  .navbar-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 20px;
    align-items: center;
  }
  .navbar-menu li {
    position: relative;
  }

  /* 기본 네비게이션 버튼 스타일 */
  .nav-btn {
    display: inline-block;
    padding: 8px 16px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
  }

  /* 로그인/회원가입 버튼 */
  .nav-btn.highlight {
    background-color: #0078d7;
    color: white;
    font-weight: bold;
  }
  .nav-btn.highlight:hover {
    background-color: #0056b3;
    color: white;
  }

  /* 로그아웃 버튼 */
  .nav-btn.logout {
    color: red;
  }
  .nav-btn.logout:hover {
    color: white;
    background-color: red;
  }

  /* 네비게이션 호버 효과 */
  .nav-btn:hover {
    color: #0078d7;
  }

  /* 반응형 스타일 (모바일) */
  @media (max-width: 767px) {
    .nav-container {
      padding: 5px 10px;
      display: flex;
      flex-direction: column; /* ✅ 한 줄씩 배치 */
      align-items: flex-start; /* ✅ 로고는 좌측 정렬 */
      text-align: left;
      width: 100%;
    }

    .navbar-content {
      display: flex;
      flex-direction: column; /* ✅ 세로 정렬 → 줄바꿈 강제 */
      width: 100%;
    }

    .navbar-logo {
      width: 100%;
      text-align: left; /* ✅ 로고는 좌측 정렬 */
      margin-bottom: 5px;
    }

    .navbar-menu {
      width: 100%;
      display: flex;
      flex-direction: row; /* ✅ 메뉴 가로 정렬 유지 */
      justify-content: flex-end; /* ✅ 메뉴를 우측 정렬 */
      flex-wrap: nowrap; /* ✅ 줄바꿈 방지 */
    }

    .navbar-menu li {
      display: inline-block; /* ✅ 가로로 정렬 */
      margin-left: 10px; /* ✅ 메뉴 간격 조정 */
    }

    .nav-btn {
      display: inline-block;
    }
  }

</style>
  