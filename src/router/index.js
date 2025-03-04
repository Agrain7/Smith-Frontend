// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'  // Vuex 스토어를 가져옵니다.
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Product from '@/components/Product.vue'
import Purchase from '@/components/Purchase.vue'
import ProductDetail from '@/components/ProductDetail.vue'
import Estimate from '@/components/Estimate.vue';
import Basket from '@/views/Basket.vue'
import Mypage from '@/views/Mypage.vue'
import AdminPanel from '@/views/AdminPanel.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Product
  },
  {
    path: '/product/:productId',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { hideBanner: true }
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: Purchase,
    meta: { minimalLayout: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { minimalLayout: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { minimalLayout: true }
  },
  {
    path: '/basket',
    name: 'Basket',
    component: Basket,
    meta: { hideBanner: true }
  },
  {
    path: '/mypage',
    name: 'Mypage',
    component: Mypage,
    meta: { hideBanner: true }
  },
  {
    path: '/estimate',
    name: 'Estimate',
    component: Estimate,
    meta: { minimalLayout: true } 
  },
  { 
    path: '/admin', 
    name: 'AdminPanel', 
    component: AdminPanel,
    meta: { requiresAdmin: true, minimalLayout: true }  // 관리자 전용 페이지임을 명시
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 네비게이션 가드: requiresAdmin이 true인 경우 관리자 여부 확인
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    const token = store.state.token;
    if (!token) {
      alert("관리자 전용 페이지입니다. 먼저 로그인하세요.");
      return next("/login");
    }
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      if (decoded.isAdmin) {
        next();
      } else {
        alert("관리자 권한이 필요합니다.");
        next("/");
      }
    } catch (error) {
      console.error("토큰 디코딩 오류:", error);
      next("/login");
    }
  } else {
    next();
  }
});


export default router;
