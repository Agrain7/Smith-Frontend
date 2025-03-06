import { createStore } from 'vuex';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default createStore({
  state: {
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
    // 오늘의 가격 관련 설정 (기본값, Banner.vue에서 사용하는 형식)
    priceConfig: {
      "비규격": {
        "9t이하": 800,
        "12~50t": 1000
      },
      "중국산": {
        "9t이하": 900,
        "12~50t": 1100
      },
      "SM275": {
        "9t이하": 1000,
        "12~50t": 1200
      },
      "SM355": {
        "9t이하": 1100,
        "12~50t": 1300
      },
      processingFee: {
        "스플라이스 철판": 180,
        "일반 철판": 160
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
