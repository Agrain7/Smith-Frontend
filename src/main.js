// frontend/src/main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'

async function init() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/price-config`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (data.success && data.config) {
      store.commit('updatePriceConfig', data.config);
    }
  } catch (error) {
    console.error("가격 설정 불러오기 실패:", error);
  }
  createApp(App).use(store).use(router).mount('#app')
}

init();
