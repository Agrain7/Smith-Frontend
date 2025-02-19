// main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'  // 라우터 파일 import
import store from './store';

createApp(App)
  .use(store)
  .use(router)                // 라우터 사용
  .mount('#app')
