<template>
  <div class="container">
    
    <!-- 소부재 가격 선택 -->
    <h2>소부재 가격을 확인하세요</h2>
    <div class="input-box">
      <div class="row">
        <fieldset>
          <legend>강종</legend>
          <select v-model="selectedSteelType">
            <option value="">선택</option>
            <option v-for="(price, type) in priceTable" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </fieldset>

        <fieldset>
          <legend>구분</legend>
          <select v-model="selectedCategory">
            <option value="">선택</option>
            <option v-for="category in Object.keys(priceTable[selectedSteelType] || {})" 
                    :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </fieldset>

        <fieldset>
          <legend>중량(kg)</legend>
          <input type="number" v-model.number="weight" placeholder="중량 입력 (kg)" @input="calculatePrice">
        </fieldset>

        <fieldset>
          <legend>금액</legend>
          <div class="price-container">
            <input type="text" class="price" :value="formattedPrice" readonly>
            <button class="check-price" @click="addPriceItem">추가</button>
          </div>
        </fieldset>
      </div>
    </div>

    <!-- 선택한 옵션 결과 -->
    <div class="result-container">
      <div v-for="(item, index) in selectedItems" :key="index" class="result-box">
        <p>{{ item.steelType }} | {{ item.category }} | {{ item.weight }}kg | {{ item.price }}</p>
        <button class="cancel-button" @click="removeItem(index)">취소</button>
      </div>
      
      <div v-if="selectedItems.length > 0" class="divider"></div>
      <div v-if="selectedItems.length > 0" class="total-sum">
        <p><strong>합계금액(VAT별도):</strong> {{ totalFormattedPrice }}</p>
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

    <!-- 모달 컴포넌트 (로그인 상태일 때 표시) -->
    <EstimateRequestModal 
      v-if="showEstimateModal" 
      :userData="currentUserData" 
      @close="showEstimateModal = false" />
  </div> 
</template>

<script>
import EstimateRequestModal from '@/components/EstimateRequestModal.vue'

export default {
  name: "SmithPage",
  components: {
    EstimateRequestModal
  },
  data() {
    return {
      priceTable: {
        "비규격": { "9t 이하": 970, "12t~50t": 940 },
        "중국산 SS400": { "9t 이하": 950, "12t~50t": 920 },
        "SS275": { "9t 이하": 990, "12t~50t": 960 },
        "SM355A": { "9t 이하": 1020, "12t~50t": 990 },
        "수입열연": { "9t 이하": 870, "12t~50t": 840 }
      },
      selectedSteelType: "SS275",
      selectedCategory: "12t~50t",
      weight: 0,
      selectedItems: []
    };
  },
  computed: {
    formattedPrice() {
      return this.calculatePrice().toLocaleString() + " 원";
    },
    totalFormattedPrice() {
      const total = this.selectedItems.reduce((sum, item) => sum + parseInt(item.price.replace(/[^0-9]/g, ""), 10), 0);
      return total.toLocaleString() + " 원";
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
    },
    calculatePrice() {
      if (!this.selectedSteelType || !this.selectedCategory || !this.weight) return 0;
      const unitPrice = this.priceTable[this.selectedSteelType]?.[this.selectedCategory] || 0;
      return Math.round((this.weight * 1.05 * unitPrice) + (this.weight * 180));
    },
    addPriceItem() {
      if (!this.selectedSteelType || !this.selectedCategory || !this.weight) {
        alert("모든 항목을 선택해 주세요.");
        return;
      }

      const price = this.formattedPrice;
      this.selectedItems.push({
        steelType: this.selectedSteelType,
        category: this.selectedCategory,
        weight: this.weight,
        price: price
      });
    },
    removeItem(index) {
      this.selectedItems.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px; /* 데스크탑에서 보기 좋게 */
  margin: auto;
  padding: 20px;
}
.input-box {
  width: 100%;
  max-width: 1000px;
  border: 2px solid black;
  display: inline-block;
  padding: 30px;
  border-radius: 30px;
}
.row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}
fieldset {
  border: none;
  padding: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
legend {
  font-size: 15px;
  font-weight: bold;
  text-align: center;
}
select, input {
  width: 120px;
  padding: 5px;
  font-size: 16px;
  text-align: center;
}
.price {
  color: red;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  width: 140px;
}
.price-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.check-price {
  padding: 5px 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}
.check-price:hover {
  background-color: #0056b3;
}
.result-container {
  margin: 0; /* 기존 마진 제거 */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 우측 정렬 */
  text-align: right;
  width: 100%;
}
.result-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 500px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.cancel-button {
  margin-left: 10px;
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
.divider {
  width: 500px;
  text-align: center;
  margin: 10px 0;
  color: #777;
}
.total-sum {
  text-align: right;
  font-weight: bold;
  margin-top: 10px;
  width: 500px;
}
/* 견적 요청 버튼 영역 */
.estimate-request {
  margin-top: 20px;
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

/* 반응형 디자인 */
@media (max-width: 768px) {
  /* 모바일 환경 (태블릿 & 스마트폰) */
  .container {
    max-width: 100%;
    padding: 10px;
  }

  /* 입력 박스 크기 조정 */
  .input-box {
    width: 90%;
    padding: 20px;
    border-radius: 15px;
  }

  /* 선택 항목을 세로로 배치 */
  .row {
    flex-direction: column; /* 가로 → 세로 배치 변경 */
    gap: 15px;
  }

  fieldset {
    width: 100%;
  }

  select, input {
    width: 100%;
    font-size: 16px; /* 가독성 증가 */
  }

  .check-price {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }

  /* 결과 박스 정렬 */
  .result-container {
    align-items: center; /* 모바일에서 중앙 정렬 */
    padding-right: 0; /* 기존 우측 패딩 제거 */
  }

  .result-box {
    width: 90%;
    text-align: center;
  }

  .total-sum {
    width: 90%;
    text-align: center;
  }
}
</style>