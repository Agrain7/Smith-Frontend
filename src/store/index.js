// frontend/store/index.js
import { createStore } from 'vuex';

// Vite 환경 변수에서 API URL을 가져옵니다.
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default createStore({
  state: {
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
  },
  mutations: {
    setToken(state, { token, autoLogin }) {
      state.token = token;
      if (autoLogin) {
        localStorage.setItem('token', token);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', token);
        localStorage.removeItem('token');
      }
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    },
  },
  actions: {
    async login({ commit }, payload) {
      try {
        const response = await fetch(`${apiUrl}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: payload.username,
            password: payload.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          commit('setToken', { token: data.token, autoLogin: payload.autoLogin });
          return { success: true };
        } else {
          return { success: false, message: data.message || '로그인 실패' };
        }
      } catch (error) {
        console.error("로그인 에러:", error);
        return { success: false, message: '서버와 통신 중 오류 발생' };
      }
    },
    logout({ commit }) {
      commit('clearToken');
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
  },
});
