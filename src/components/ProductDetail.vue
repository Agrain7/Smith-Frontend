<!-- frontend/src/components/ProductDetail.vue -->
<template>
  <div class="product-detail">
    <!-- 왼쪽 영역: 제품 이미지 -->
    <div class="left-side">
      <img :src="product.image" alt="제품 이미지" class="product-image" />
    </div>

    <!-- 오른쪽 영역: 제품 정보 및 액션 영역 -->
    <div class="right-side">
      <!-- 중앙 섹션: 제품명, 설명 -->
      <div class="middle-section">
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-description">{{ product.description }}</p>
      </div>

      <!-- 주문 정보 섹션 (두 영역으로 구성) -->
      <div class="order-info">
        <!-- 왼쪽 영역: 철강가격 및 가공비 -->
        <div class="order-left">
          <p class="price-title">오늘의 철강가격:</p>
          <label>
            <input type="radio" value="SM275" v-model="selectedMaterial" />
            SM275 <span class="material-price">(1000원/kg)</span>
          </label>
          <label>
            <input type="radio" value="SM355" v-model="selectedMaterial" />
            SM355 <span class="material-price">(1200원/kg)</span>
          </label>
          <p class="processing-fee">오늘의 가공비 199원/kg</p>
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
        <!-- ? 버튼은 로그인 상태가 아닐 때 비활성화, 로그인 상태이면 클릭 시 Estimate 페이지로 이동 -->
        <button class="help-button" 
                @click="showHelp" 
                :disabled="!isLoggedIn">?</button>
      </div>

      <!-- 진행상황 텍스트 (오른쪽 정렬) -->
      <div class="progress-status">
        <p>진행상황: {{ estimate.fileSubmitted ? '견적파일 제출완료' : '견적파일 미제출' }}</p>
        <button class="detail-estimate-button" @click="onDetailEstimateClick" :disabled="isDetailDisabled">
          {{ detailStatus }}
        </button>
      </div>

      <!-- 액션 버튼: 바로 구매 -->
      <div class="action-buttons">
        <button class="buy-button" @click="buyNow" :disabled="isDetailDisabled">바로 구매 ></button>
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
import product4 from '@/assets/product4.webp'
import product5 from '@/assets/product5.webp'
import product6 from '@/assets/product6.webp'

export default {
  name: "ProductDetail",
  components: {
    EstimateRequestModal
  },
  data() {
    return {
      products: {
        '현장용소부재': {
          image: product1,
          name: '현장용소부재',
          description: '현장용소부재에 대한 상세 설명입니다.',
        },
        '공장용소부재': {
          image: product2,
          name: '공장용소부재',
          description: '공장용소부재에 대한 상세 설명입니다.',
        },
        '철판': {
          image: product3,
          name: '철판',
          description: '철판에 대한 상세 설명입니다.',
        },
        '브라켓': {
          image: product4,
          name: '브라켓',
          description: '브라켓에 대한 상세 설명입니다.',
        },
        '볼트': {
          image: product5,
          name: '볼트',
          description: '볼트에 대한 상세 설명입니다.',
        },
        '야': {
          image: product6,
          name: '야',
          description: '야 제품에 대한 상세 설명입니다.',
        },
      },
      selectedMaterial: 'SM275',
      quantity: 1,
      uploadStatus: '견적파일 미제출',
      detailStatus: '세부견적 확인',
      isDetailDisabled: true,
      showEstimateModal: false,
    }
  },
  computed: {
    product() {
      const productId = this.$route.params.productId;
      return this.products[productId] || { name: '', description: '', image: '' };
    },
    computedPrice() {
      const basePrice = this.selectedMaterial === 'SM275' ? 1000 : 1200;
      const processingFee = 199;
      return (basePrice + processingFee) * 1000 * this.quantity;
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
    },
    // ? 버튼 클릭 시 로그인 여부 확인 후 Estimate 페이지로 이동
    showHelp() {
      if (!this.isLoggedIn) {
        alert("로그인 후 이용 가능합니다.");
        return;
      }
      this.$router.push('/estimate');
    },
    onDetailEstimateClick() {
      // 견적 요청 상태 확인 API 호출 (예시)
      fetch(`${import.meta.env.VITE_API_URL}/api/estimate-request/status`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(res => res.json())
        .then(data => {
          if (data.approved) {
            this.isDetailDisabled = false;
            alert("세부견적이 승인되었습니다.");
          } else {
            alert("아직 견적 요청이 승인되지 않았습니다.");
          }
        })
        .catch(error => {
          console.error(error);
          alert("견적 요청 상태 확인 중 오류 발생");
        });
    },
    buyNow() {
      const basePrice = this.selectedMaterial === 'SM275' ? 1000 : 1200;
      const processingFee = 199;
      const totalPrice = (basePrice + processingFee) * 1000 * this.quantity;
      const shippingCost = 3000; // 예시 배송비
      const url = `/purchase?price=${totalPrice}&shipping=${shippingCost}`;
      window.open(url, '_blank', 'width=800,height=800');
    }
  },
  mounted() {
    // 필요 시 초기 데이터 fetch
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
.left-side {
  flex: 1;
}
.product-image {
  width: 100%;
  object-fit: contain;
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
.product-description {
  font-size: 16px;
  color: #555;
}
.order-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
.material-selection label {
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 5px;
}
.material-price {
  margin-left: 5px;
  font-size: 14px;
  color: #777;
}
.processing-fee {
  font-size: 14px;
  color: #555;
  margin-top: 5px;
}
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
.help-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #6d9eff, #007bff);
  color: #fff;
  cursor: pointer;
  position: relative;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.help-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}
.progress-status {
  text-align: right;
  font-size: 16px;
  color: #333;
}
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
}
.buy-button {
  width: 50%;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid #007bff;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
}
.buy-button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}
</style>
