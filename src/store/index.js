// frontend/src/store/index.js
import { createStore } from 'vuex';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default createStore({
  state: {
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
    // 오늘의 가격 관련 설정 (기본값)
    priceConfig: {
      sm275: 1000,
      sm355: 1200,
      processingFee: {
        "현장용소부재": 199,
        "공장용소부재": 188,
        "브라켓": 177
      }
    }
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
    // priceConfig 업데이트 mutation
    updatePriceConfig(state, payload) {
      state.priceConfig = {
        ...state.priceConfig,
        ...payload,
        processingFee: {
          ...state.priceConfig.processingFee,
          ...payload.processingFee
        }
      };
    }
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
    // 오늘의 가격 설정 업데이트 액션
    updatePriceConfig({ commit }, newConfig) {
      commit('updatePriceConfig', newConfig);
    }
  },
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
    priceConfig(state) {
      return state.priceConfig;
    }
  },
});
