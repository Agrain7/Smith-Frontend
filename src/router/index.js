// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Product from '@/components/Product.vue'
import Purchase from '@/components/Purchase.vue'
import ProductDetail from '@/components/ProductDetail.vue'
import Basket from '@/views/Basket.vue'
import Mypage from '@/views/Mypage.vue'

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
