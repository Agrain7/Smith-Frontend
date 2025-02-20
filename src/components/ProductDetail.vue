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
        <!-- disabled 속성 대신 클래스로 스타일 적용 -->
        <button 
          class="estimate-button" 
          :class="{ disabled: !isLoggedIn }"
          @click="handleEstimateRequest">
          세부단가 견적요청
        </button>
        <button class="help-button" @click="showHelp">?</button>
        <!-- 숨겨진 파일 입력 -->
        <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
      </div>

      <!-- 진행상황 텍스트 (오른쪽 정렬) -->
      <div class="progress-status">
        <p>진행상황: {{ uploadStatus }}</p>
        <button class="detail-estimate-button" @click="onDetailEstimateClick" :disabled="isDetailDisabled">
          {{ detailStatus }}
        </button>
      </div>

      <!-- 액션 버튼: 바로 구매 -->
      <div class="action-buttons">
        <button class="buy-button" @click="buyNow" :disabled="isDetailDisabled">바로 구매 ></button>
      </div>
    </div>
  </div>
</template>

<script>
import productImage1 from '@/assets/product1.webp';
import productImage2 from '@/assets/product2.webp';
import productImage3 from '@/assets/product3.webp';
import productImage4 from '@/assets/product4.webp';
import productImage5 from '@/assets/product5.webp';
import productImage6 from '@/assets/product6.webp';
import emailjs from 'emailjs-com';

export default {
  name: 'ProductDetail',
  data() {
    return {
      // 제품 데이터는 라우트 파라미터(productId)로 결정됩니다.
      products: {
        '현장용소부재': {
          image: productImage1,
          name: '현장용소부재',
          description: '현장용소부재에 대한 상세 설명입니다.',
        },
        '공장용소부재': {
          image: productImage2,
          name: '공장용소부재',
          description: '공장용소부재에 대한 상세 설명입니다.',
        },
        '철판': {
          image: productImage3,
          name: '철판',
          description: '철판에 대한 상세 설명입니다.',
        },
        '브라켓': {
          image: productImage4,
          name: '브라켓',
          description: '브라켓에 대한 상세 설명입니다.',
        },
        '볼트': {
          image: productImage5,
          name: '볼트',
          description: '볼트에 대한 상세 설명입니다.',
        },
        '야': {
          image: productImage6,
          name: '야',
          description: '야 제품에 대한 상세 설명입니다.',
        },
      },
      selectedMaterial: 'SM275',
      quantity: 1,
      // 진행상황 상태 변수
      uploadStatus: '견적파일 미제출',
      detailStatus: '세부견적 확인',
      isDetailDisabled: true,
    };
  },
  computed: {
    product() {
      const productId = this.$route.params.productId;
      return this.products[productId] || { name: '', description: '', image: '' };
    },
    computedPrice() {
      // SM275: (1000 + 199) * 1000 * 주문수량, SM355: (1200 + 199) * 1000 * 주문수량
      const basePrice = this.selectedMaterial === 'SM275' ? 1000 : 1200;
      const processingFee = 199;
      return (basePrice + processingFee) * 1000 * this.quantity;
    },
    computedPriceFormatted() {
      return this.computedPrice.toLocaleString('ko-KR');
    },
    // 로그인 상태를 Vuex에서 가져옴
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    handleEstimateRequest() {
      // 만약 로그인하지 않은 상태라면 경고창 표시 후 로그인 페이지로 리다이렉션
      if (!this.isLoggedIn) {
        alert("로그인 후 사용하세요.");
        this.$router.push("/login");
        return;
      }
      // 로그인한 상태라면 기존 파일 업로드 기능 실행
      this.triggerFileUpload();
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onloadend = () => {
            const textContent = reader.result;
            const templateParams = {
              to_email: 'smithagent@nate.com',
              file_content: textContent,
              filename: file.name,
            };
            emailjs.send('service_ut6rmkh', 'template_f7rf82t', templateParams, 'umd5YAQiBuxttvCy2')
              .then(
                (response) => {
                  console.log('이메일 전송 성공:', response.status, response.text);
                  alert(`파일 업로드 및 전송 성공: ${file.name}`);
                  // 파일 전송 성공 시 진행상황 업데이트
                  this.uploadStatus = '견적파일 제출완료';
                },
                (error) => {
                  console.error('이메일 전송 실패:', error);
                  alert('파일 전송에 실패하였습니다.');
                }
              );
          };
          reader.readAsText(file);
        } else {
          alert('TXT 파일만 전송 가능합니다.');
        }
      }
    },
    onDetailEstimateClick() {
      // 로그인한 상태라면 견적 승인 여부를 확인하는 API 호출 (예시)
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
    },
    showHelp() {
      alert('세부 단가 견적 요청에 대한 자세한 안내를 제공합니다.');
      this.isDetailDisabled = false;
    },
  },
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

/* 왼쪽 영역: 이미지 */
.left-side {
  flex: 1;
}

.product-image {
  width: 100%;
  object-fit: contain;
}

/* 오른쪽 영역: 제품 정보 및 액션 영역 */
.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 중앙 섹션: 제품명, 설명 중앙 정렬 */
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

/* 주문 정보 섹션: 왼쪽과 오른쪽 영역으로 구성 */
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

/* 오른쪽 영역: 주문수량 및 가격 */
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

/* 가격 표시 영역을 한 줄로 배치 */
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

/* 세부단가 견적요청 섹션 */
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

/* disabled 클래스로 시각적 효과 적용 */
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

.detail-estimate-button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.detail-estimate-button:hover {
  background-color: #e2e6ea;
}

.detail-estimate-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background-color: #f0f0f0;
}

/* 진행상황 텍스트 (오른쪽 정렬) */
.progress-status {
  text-align: right;
}

.progress-status p {
  margin: 2px 0;
  font-size: 16px;
  color: #333;
}

/* 액션 버튼 (바로 구매 버튼) */
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
