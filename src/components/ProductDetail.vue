<template>
  <div class="product-detail">
    <!-- 오른쪽 영역: 제품 정보 및 액션 영역 -->
    <div class="right-side">
      <!-- 중앙 섹션: 제품명만 표시 -->
      <div class="middle-section">
        <h1 class="product-name">{{ product.name }}</h1>
      </div>

      <!-- 주문 정보 섹션 -->
      <div class="order-info">
        <!-- 오늘의 철판가격 영역 -->
        <div class="order-left">
          <p class="price-title">오늘의 철판가격:</p>
          <div class="material-selection">
            <div class="material-options">
              <!-- 각 재료 그룹을 한 줄에 배치 -->
              <div v-for="material in materials" :key="material" class="material-group">
                <span class="material-label">{{ material }}</span>
                <div class="weight-options">
                  <!-- 무게 카테고리 순서: 12~50t 먼저, 그 다음 9t이하 -->
                  <label v-for="weight in weightCategories" :key="material + '_' + weight">
                    <input type="radio"
                           :value="material + '_' + weight"
                           v-model="selectedMaterialOption" />
                    <span>
                      {{ weight }} ({{ priceConfig[material][weight] }}원/kg)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 오늘의 가공비 영역 -->
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

        <!-- 주문 수량 및 예상 가격 영역 -->
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

    <!-- 모달 컴포넌트 (로그인 상태일 때 표시) -->
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
import emitter from '@/eventBus'; // 이벤트 버스 가져오기

export default {
  name: "ProductDetail",
  components: {
    EstimateRequestModal
  },
  data() {
    return {
      // 제품 목록 (이미지 등은 그대로 유지)
      products: {
        '현장용 소부재': {
          image: product1,
          name: '현장용 소부재',
          description: '현장용 소부재에 대한 상세 설명입니다.'
        },
        '공장용 소부재': {
          image: product2,
          name: '공장용 소부재',
          description: '공장용 소부재에 대한 상세 설명입니다.'
        },
        '브라켓': {
          image: product3,
          name: '브라켓',
          description: '브라켓에 대한 상세 설명입니다.'
        }
      },
      // 선택된 재료 옵션: "재료_무게" 형식 (예: "SM275_12~50t")
      selectedMaterialOption: 'SM275_12~50t',
      // 선택된 가공비 옵션 (기본값)
      selectedProcessingFee: '스플라이스 철판',
      quantity: 1,
      showEstimateModal: false,
      // 재료 목록
      materials: ["비규격", "중국산", "SM275", "SM355"],
      // 무게 카테고리: 12~50t가 먼저, 9t이하가 나중
      weightCategories: ["12~50t", "9t이하"],
    }
  },
  computed: {
    // Vuex 스토어의 가격 설정 값을 가져옴
    priceConfig() {
      return this.$store.state.priceConfig;
    },
    // 제품 정보 (제품명만 사용)
    product() {
      const productId = this.$route.params.productId;
      const baseProduct = this.products[productId] || this.products['현장용 소부재'];
      return baseProduct;
    },
    computedPrice() {
      // selectedMaterialOption: "SM275_12~50t" 형식에서 분리
      const parts = this.selectedMaterialOption.split('_');
      const material = parts[0];
      const weight = parts[1];
      const materialPrice = this.priceConfig[material][weight] || 0;
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
      // 견적 요청 제출 시 제품명과 예시 프로젝트명("새 프로젝트")을 포함한 주문 데이터를 생성
      const newOrder = {
        id: Date.now(), // 유니크 id
        productName: this.product.name,
        projectName: "새 프로젝트", // 실제 프로젝트명 입력값으로 대체 가능
        status: "견적 전송 완료"
      };
      // 이벤트 버스를 통해 주문 데이터를 발행
      emitter.emit('orderSubmitted', newOrder);
      this.showEstimateModal = true;
    }
  }
};
</script>

<style scoped>
.product-detail {
  width: 100%;
  max-width: 720px;
  margin: 20px auto;
  display: flex;
  gap: 20px;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}

/* 오른쪽 영역 전체 */
.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 중앙 섹션: 제품명만 표시 */
.middle-section {
  text-align: center;
}
.product-name {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

/* 주문 정보 섹션 */
.order-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid #ddd;
  padding: 10px;
}

/* 재료 선택 및 가공비 선택 영역 */
.material-selection, .processing-selection {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 각 재료 그룹: 한 줄에 배치 */
.material-group {
  display: flex;
  align-items: center;
  gap: 20px;
}
.material-label {
  font-weight: bold;
  font-size: 16px;
}
.material-options {
  display: flex;
  flex-direction: column; /* 각 재료 그룹을 세로로 나열 */
  gap: 20px; /* 그룹 사이 간격 */
}

/* 무게 옵션들을 한 줄에 배치 */
.weight-options {
  display: flex;
  gap: 20px;
}
.weight-options label {
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
.material-price {
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
.price-title {
  text-align: left;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
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
