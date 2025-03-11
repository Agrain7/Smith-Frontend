// [frontend] /src/main.js
import { createApp } from 'vue';  // Vue 앱 생성
import App from './App.vue';      // App.vue 불러오기
import './style.css';             // 전역 스타일 적용
import router from './router'     // 라우터 연결
import store from './store'       // 스토어 연결

async function init() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // console.log(`[INFO] API URL: ${apiUrl}`); // API URL 로깅

    const res = await fetch(`${apiUrl}/api/price-config`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      credentials: "include" // CORS 요청 시 쿠키/세션 포함 가능하도록 설정
    });
    if (!res.ok) {
      throw new Error(`HTTP 오류 상태: ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.config) {
      // console.log("[INFO] 가격 설정 데이터 불러오기 성공:", data.config);
      store.commit('updatePriceConfig', data.config);
    } else {
      // console.warn("[WARNING] 가격 설정 데이터가 올바르지 않음:", data);
    }
  } catch (error) {
    console.error("가격 설정 불러오기 실패:", error);
  }
  createApp(App).use(store).use(router).mount('#app')
}

init();
