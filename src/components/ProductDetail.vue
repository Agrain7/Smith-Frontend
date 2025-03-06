<template>
  <div class="product-detail">
    <!-- 왼쪽 영역: 이미지 제거 -->
    
    <!-- 오른쪽 영역: 제품 정보 및 액션 영역 -->
    <div class="right-side">
      <!-- 중앙 섹션: 제품명, 설명 -->
      <div class="middle-section">
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-description">{{ product.description }}</p>
      </div>

      <!-- 주문 정보 섹션 (두 그룹: 철판가격 선택 및 가공비 선택) -->
      <div class="order-info">
        <!-- 재료 선택 영역: 오늘의 철판가격 -->
        <div class="order-left">
          <p class="price-title">오늘의 철판가격:</p>
          <div class="material-selection">
            <label>
              <input type="radio" value="비규격" v-model="selectedMaterial" />
              비규격 <span class="material-price">( {{ priceConfig["비규격"]["9t이하"] }}원/kg )</span>
            </label>
            <label>
              <input type="radio" value="중국산" v-model="selectedMaterial" />
              중국산 <span class="material-price">( {{ priceConfig["중국산"]["9t이하"] }}원/kg )</span>
            </label>
            <label>
              <input type="radio" value="SM275" v-model="selectedMaterial" />
              SM275 <span class="material-price">( {{ priceConfig["SM275"]["9t이하"] }}원/kg )</span>
            </label>
            <label>
              <input type="radio" value="SM355" v-model="selectedMaterial" />
              SM355 <span class="material-price">( {{ priceConfig["SM355"]["9t이하"] }}원/kg )</span>
            </label>
          </div>
        </div>

        <!-- 가공비 선택 영역 -->
        <div class="order-left">
          <p class="price-title">오늘의 가공비:</p>
          <div class="processing-selection">
            <label>
              <input type="radio" value="스플라이스 철판" v-model="selectedProcessingFee" />
              스플라이스 철판 <span class="material-price">( {{ priceConfig.processingFee["스플라이스 철판"] }}원/kg )</span>
            </label>
            <label>
              <input type="radio" value="일반 철판" v-model="selectedProcessingFee" />
              일반 철판 <span class="material-price">( {{ priceConfig.processingFee["일반 철판"] }}원/kg )</span>
            </label>
          </div>
        </div>

        <!-- 오른쪽 영역: 주문수량 및 가격 -->
        <div class="order-right">
          <div class="quantity-input">
            <span>주문수량 :</span>
            <input type="number" v-model.number="quantity" min="1" step="0.1" />
            <span class="unit-text"> ton</span>
          </div>
          <div class="price-display">
            <p class="expected-price">예상가격:</p>
            <p class="product-price">{{ computedPriceFormatted }}원</p>
          </div>
        </div>
      </div>

      <!-- 세부단가 견적요청 섹션 -->
      <div class="estimate-request">
        <button 
          class="estimate-button" 
          :class="{ disabled: !isLoggedIn }"
          @click="handleEstimateRequest">
          세부단가 견적요청
        </button>
      </div>
    </div>

    <!-- 모달 컴포넌트 (로그인 상태라면 열림) -->
    <EstimateRequestModal 
      v-if="showEstimateModal" 
      :userData="currentUserData" 
      @close="showEstimateModal = false" />
  </div>
</template>

<script>
import EstimateRequestModal from '@/components/EstimateRequestModal.vue'
import product1 from '@/assets/product1.webp'
import product2 from '@/assets/product2.webp'
import product3 from '@/assets/product3.webp'

export default {
  name: "ProductDetail",
  components: {
    EstimateRequestModal
  },
  data() {
    return {
      // 제품 목록은 그대로 유지 (필요한 경우 업데이트)
      products: {
        '현장용소부재': {
          image: product1,
          name: '현장용소부재',
          description: '현장용소부재에 대한 상세 설명입니다.'
        },
        '공장용소부재': {
          image: product2,
          name: '공장용소부재',
          description: '공장용소부재에 대한 상세 설명입니다.'
        },
        '브라켓': {
          image: product3,
          name: '브라켓',
          description: '브라켓에 대한 상세 설명입니다.'
        }
      },
      selectedMaterial: 'SM275',          // 재료 선택 (기본값)
      selectedProcessingFee: '스플라이스 철판',  // 가공비 선택 (기본값)
      quantity: 1,
      showEstimateModal: false,
    }
  },
  computed: {
    // Vuex 스토어의 가격 설정 값을 가져옴
    priceConfig() {
      return this.$store.state.priceConfig;
    },
    // 제품 정보는 그대로 사용 (이미지 제외)
    product() {
      const productId = this.$route.params.productId;
      const baseProduct = this.products[productId] || this.products['현장용소부재'];
      return baseProduct;
    },
    computedPrice() {
      // 여기서는 기본적으로 '9t이하' 가격을 사용한다고 가정
      const materialPrice = this.priceConfig[this.selectedMaterial]["9t이하"] || 0;
      const processingFee = this.priceConfig.processingFee[this.selectedProcessingFee] || 0;
      return (materialPrice + processingFee) * 1000 * this.quantity;
    },
    computedPriceFormatted() {
      return this.computedPrice.toLocaleString('ko-KR');
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    currentUserData() {
      const token = this.$store.state.token || localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return {};
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payload))));
        return {
          username: decoded.username || '',
          name: decoded.name || '',
          phone: decoded.phone || '',
          email: decoded.email || ''
        };
      } catch (error) {
        console.error("토큰 파싱 오류:", error);
        return {};
      }
    }
  },
  methods: {
    handleEstimateRequest() {
      if (!this.isLoggedIn) {
        alert("로그인 후 사용하세요.");
        this.$router.push("/login");
        return;
      }
      this.showEstimateModal = true;
    }
  }
};
</script>

<style scoped>
.product-detail {
  width: 100%;
  max-width: 1080px;
  margin: 20px auto;
  display: flex;
  gap: 20px;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}
/* 왼쪽 이미지 영역 제거하므로 .left-side 관련 스타일은 삭제 */

/* 오른쪽 영역 전체 */
.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 중앙 섹션: 제품명, 설명 */
.middle-section {
  text-align: center;
}
.product-name {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}
.product-description {
  font-size: 16px;
  color: #555;
}

/* 주문 정보 섹션 */
.order-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid #ddd;
  padding: 10px;
}
.order-left {
  display: flex;
  flex-direction: column;
}
.price-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px;
  text-align: left;
}
.material-selection label,
.processing-selection label {
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 5px;
  display: block;
}
.material-price {
  margin-left: 5px;
  font-size: 14px;
  color: #777;
}

/* 주문 오른쪽 영역: 수량 및 가격 */
.order-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}
.quantity-input {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
.quantity-input input {
  width: 80px;
  margin: 0 5px;
  text-align: right;
  font-size: 16px;
  padding: 2px 4px;
}
.unit-text {
  font-size: 16px;
  font-weight: bold;
}
.price-display {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 1px;
  text-align: right;
}
.expected-price {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}
.product-price {
  font-size: 20px;
  font-weight: bold;
  color: #d9534f;
  margin: 0;
}

/* 견적 요청 버튼 영역 */
.estimate-request {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}
.estimate-button {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  border: 2px dashed #28a745;
  background-color: transparent;
  color: #28a745;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}
.estimate-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.estimate-button:hover {
  background-color: #28a745;
  color: #fff;
}
</style>
