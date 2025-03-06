<template>
  <div class="product-detail">
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
                  {{ priceConfig[material][weight] }}원/kg
                  <input type="number"
                         v-model.number="orderQuantities[material + '_' + weight]"
                         min="0"
                         class="quantity-input-field" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 오늘의 가공비 영역 (변경 없음) -->
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

        <!-- 주문 수량 총합 및 예상 가격 영역 -->
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
import product1 from '@/assets/product1.webp'
import product2 from '@/assets/product2.webp'
import product3 from '@/assets/product3.webp'
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
      // 각 옵션별 주문수량을 관리하는 객체
      orderQuantities: {
        "비규격_12~50t": 1, // 기본: 비규격 12~50t = 1
        "비규격_9t이하": 0,
        "중국산_12~50t": 0,
        "중국산_9t이하": 0,
        "SM275_12~50t": 0,
        "SM275_9t이하": 0,
        "SM355_12~50t": 0,
        "SM355_9t이하": 0
      },
      // 재료 목록과 무게 카테고리
      materials: ["비규격", "중국산", "SM275", "SM355"],
      weightCategories: ["12~50t", "9t이하"],
      // 선택된 가공비 옵션 (기본값)
      selectedProcessingFee: '스플라이스 철판',
      showEstimateModal: false,
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
      let sum = 0;
      for (const material of this.materials) {
        for (const weight of this.weightCategories) {
          const key = material + '_' + weight;
          const qty = this.orderQuantities[key] || 0;
          const price = this.priceConfig[material][weight] || 0;
          sum += price * qty;
        }
      }
      return sum * 1000;
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
    async handleEstimateRequest() {
      if (!this.isLoggedIn) {
        alert("로그인 후 사용하세요.");
        this.$router.push("/login");
        return;
      }
      // 주문 데이터에 옵션별 주문수량 정보를 포함하여 전송
      const newOrder = {
        username: this.currentUserData.username,
        productName: this.product.name,
        // orderDetails로 각 옵션의 주문수량 정보를 보냅니다.
        orderDetails: { ...this.orderQuantities },
        status: "견적 요청 전송 완료"
      };
      const token = this.$store.state.token || localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        const response = await fetch('https://smithapp-bbc6f2929f0b.herokuapp.com/api/orders', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newOrder)
        });
        const data = await response.json();
        if (response.ok) {
          emitter.emit('orderSubmitted', data.order);
          this.showEstimateModal = true;
        } else {
          alert(data.message || "주문 제출 실패");
        }
      } catch (error) {
        console.error("주문 제출 중 오류:", error);
        alert("서버와 통신 중 오류 발생");
      }
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

/* 예상 가격 영역 */
.price-display {
  text-align: center;
  margin-top: 10px;
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
  margin-top: 5px;
  text-align: center;
}
</style>
