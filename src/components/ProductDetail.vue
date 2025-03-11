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
          <p class="price-title">오늘의 철판가격</p>
          <table class="price-table">
            <thead>
              <tr>
                <th></th>
                <th v-for="material in materials" :key="material">{{ material }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="weight in weightCategories" :key="weight">
                <td>{{ weight }}</td>
                <td v-for="material in materials" :key="material + '_' + weight">
                  <div class="price-input-container">
                    <span class="price-text">({{ priceConfig[material][weight] }}원/kg)</span>
                    <input type="number"
                           v-model.number="orderQuantities[material + '_' + weight]"
                           min="0" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 오늘의 가공비 영역 -->
        <div class="order-left">
          <p class="price-title">오늘의 가공비</p>
          <div class="processing-selection">
            <label>
              <input type="radio" value="스플라이스 철판" v-model="selectedProcessingFee" />
              스플라이스 철판 <span class="material-price">({{ priceConfig.processingFee["스플라이스 철판"] }}원/kg)</span>
            </label>
            <label>
              <input type="radio" value="일반 철판" v-model="selectedProcessingFee" />
              일반 철판 <span class="material-price">({{ priceConfig.processingFee["일반 철판"] }}원/kg)</span>
            </label>
          </div>
        </div>

        <!-- 주문 수량 및 예상 가격 영역 (전체 옵션 수량과 가공비를 반영한 예상 가격 계산) -->
        <div class="order-right">
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
import emitter from '@/eventBus';

export default {
  name: "ProductDetail",
  components: {
    EstimateRequestModal
  },
  data() {
    return {
      products: {
        '현장용 소부재': {
          name: '현장용 소부재',
          description: '현장용 소부재에 대한 상세 설명입니다.'
        },
        '공장용 소부재': {
          name: '공장용 소부재',
          description: '공장용 소부재에 대한 상세 설명입니다.'
        },
        '브라켓': {
          name: '브라켓',
          description: '브라켓에 대한 상세 설명입니다.'
        }
      },
      // 각 옵션별 주문수량을 관리하는 객체 (기본값: SM275 옵션만 1000, 나머지는 0)
      orderQuantities: {
        "비규격_12~50t": 0,
        "비규격_9t이하": 0,
        "중국산_12~50t": 0,
        "중국산_9t이하": 0,
        "SM275_12~50t": 1000,
        "SM275_9t이하": 500,
        "SM355_12~50t": 0,
        "SM355_9t이하": 0
      },
      materials: ["비규격", "중국산", "SM275", "SM355"],
      weightCategories: ["12~50t", "9t이하"],
      selectedProcessingFee: '스플라이스 철판',
      showEstimateModal: false,
      // quantity는 개별 입력으로 관리되므로 별도의 변수는 사용하지 않음
    }
  },
  computed: {
    priceConfig() {
      return this.$store.state.priceConfig;
    },
    product() {
      const productId = this.$route.params.productId;
      const baseProduct = this.products[productId] || this.products['현장용 소부재'];
      return baseProduct;
    },
    computedPrice() {
      // 각 옵션별 (가격 * 주문수량) 합계
      let optionsSum = 0;
      let totalQty = 0;
      for (const material of this.materials) {
        for (const weight of this.weightCategories) {
          const key = material + '_' + weight;
          const qty = this.orderQuantities[key] || 0;
          const price = this.priceConfig[material][weight] || 0;
          optionsSum += price * qty;
          totalQty += qty;
        }
      }
      // 최종 계산: (옵션 합계 + (전체 수량 * 가공비))
      const processingFee = this.priceConfig.processingFee[this.selectedProcessingFee] || 0;
      return (optionsSum*1.05 + (totalQty * processingFee));
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
      // 단순히 모달만 띄우도록 수정 (주문 데이터 전송은 모달에서 처리)
      this.showEstimateModal = true;
    }
  }
};
</script>

<style scoped>
.product-detail {
  width: 100%;
  max-width: 1912px;
  margin: 20px auto;
  display: flex;
  gap: 20px;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}

.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.middle-section {
  text-align: center;
}
.product-name {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid #ddd;
  padding: 10px;
}

/* 가격 표 스타일 */
.price-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}
.price-table th,
.price-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}
.price-title {
  text-align: left;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}

/* 컨테이너로 가격 텍스트와 입력창을 가로 배치 */
.price-input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  width: 100%;
}

.price-text {
  flex: 1;
  font-size: 14px;
}

/* 예상 가격 영역 */
.price-display {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 1px;
}
.expected-price {
  font-size: 18px;
  font-weight: bold;
}
.product-price {
  font-size: 22px;
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

/* 입력 필드 스타일 */
.price-table input[type="number"] {
  width: 60px;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

.processing-selection {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
