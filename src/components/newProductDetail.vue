<!-- newProductDetail.vue -->
<template>
  <div class="container">
    <h2>소부재 가격을 확인하세요</h2>

    <!-- 소부재 가격 선택 -->
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
          <input type="number" v-model.number="weight" placeholder="중량 입력 (kg)">
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
      <div v-for="(item, index) in formattedItems" :key="index" class="result-box">
        <p class="item-info">
          {{ item.steelType }} | {{ item.category }} | {{ item.formattedWeight  }}kg
        </p>
        <p class="item-price">
          {{ item.price }}
        </p>
        <button class="cancel-button" @click="removeItem(index)">취소</button>
      </div>
      
      <div v-if="selectedItems.length > 0" class="divider"></div>
      <div v-if="selectedItems.length > 0" class="total-sum">
        <p><strong>합계금액(VAT별도) : </strong> {{ totalFormattedPrice }}</p>
      </div>
    </div>
    

    <!-- 세부단가 견적요청 섹션 -->
    <div class="estimate-request">
      <button 
        class="estimate-button"
        :class="{ disabled: !isLoggedIn }"
        @click="handleEstimateRequest">
        견적서 확인
      </button>
    </div>

    <div class="estimate-request">
      <button 
        class="estimate-button"
        :class="{ disabled: !isLoggedIn }"
        @click="handleEstimateCheck">
        견적요청
      </button>
    </div>


    <!-- 세부단가 견적요청 모달 (로그인 상태일 때 표시) -->
    <newEstimateRequestModal 
        v-if="isRequestModalOpen && selectedItems.length > 0" 
      :isOpen="isRequestModalOpen"
      :userData="currentUserData" 
      :quotationItems="selectedItems" 
      @close="isRequestModalOpen = false" />
    <!-- 견적서 확인 모달 (로그인 상태일 때 표시) -->
    <newEstimateCheckModal 
      v-if="isCheckModalOpen" 
      :isOpen="isCheckModalOpen"
      :userData="currentUserData" 
      @close="isCheckModalOpen  = false"
    />  

  </div> 
</template>
  
<script>
  import newEstimateRequestModal from '@/components/newEstimateRequestModal.vue'
  import newEstimateCheckModal from '@/components/newEstimateCheckModal.vue'
  
  export default {
    name: "NewProductDetail",
    components: {
      newEstimateRequestModal,
      newEstimateCheckModal
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
        weight: null,
        selectedItems: [],
        ProcessingFee: 180,
        isRequestModalOpen: false,  // "세부단가 견적요청" 모달 상태
        isCheckModalOpen: false,    // "견적서 확인" 모달 상태
      };
    },
    computed: {
      formattedPrice() {
        if (!this.selectedSteelType || !this.selectedCategory || !this.weight) return "0 원";
        const unitPrice = this.priceTable[this.selectedSteelType]?.[this.selectedCategory] || 0;
        const totalPrice = Math.round((this.weight * 1.05 * unitPrice) + (this.weight * this.ProcessingFee));
        return `${totalPrice.toLocaleString()} 원`;
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
      },
      formattedItems() {
        return this.selectedItems.map(item => ({
          ...item,
          formattedWeight: item.weight.toLocaleString()   // ✅ 천단위 콤마 추가
        }));
      }
    },
    methods: {
      handleEstimateRequest() {
        if (!this.isLoggedIn) {
          alert("로그인 후 사용하세요.");
          this.$router.push("/login");
          return;
        }
        if (this.selectedItems.length === 0) {
          alert("견적 요청할 항목이 없습니다."); // 추가된 항목이 없으면 알림
          return;
        }
        this.isRequestModalOpen  = true;
      },
      handleEstimateCheck() {
        if (!this.isLoggedIn) {
          alert("로그인 후 사용하세요.");
          this.$router.push("/login");
          return;
        }
        // if (this.selectedItems.length === 0) {
        //   alert("견적 요청할 항목이 없습니다."); // 추가된 항목이 없으면 알림
        //   return;
        // }
        this.isCheckModalOpen = true;
      },
      addPriceItem() {
        if (!this.selectedSteelType || !this.selectedCategory || !this.weight) {
          alert("값을 입력해주세요.");
          return;
        }
        this.selectedItems.push({
          steelType: this.selectedSteelType,
          category: this.selectedCategory,
          weight: this.weight,
          price: this.formattedPrice
        });
        this.weight = null;
      },
      removeItem(index) {
        this.selectedItems.splice(index, 1);
      }
    }
  };
</script>


<style scoped>
  /* ✅ 기본 컨테이너 */
  .container {
    width: 70%;
    max-width: 1080px;
    margin: auto;
    padding: 20px;
    margin-top: 30px;
  }
  .container h2 {
    font-size: 20px;
    text-align: center;
  }

  /* ✅ 입력 박스 (웹 & 모바일 공통) */
  .input-box {
    width: 100%;
    border: 2px solid black;
    padding: 30px;
    border-radius: 30px;
    box-sizing: border-box;
  }

  /* ✅ 입력 필드 row (웹에서는 가로 정렬) */
  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    flex-wrap: nowrap; /* 모바일에서는 변경 */
  }

  /* ✅ fieldset 기본 스타일 */
  fieldset {
    border: none;
    padding: 5px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
  }
  fieldset:nth-child(1) { /* 첫 번째 fieldset (강종) */
    flex-basis: 20%;
    min-width: 100px;
  }
  fieldset:nth-child(2) { /* 두 번째 fieldset (구분) */
    flex-basis: 20%;
    min-width: 100px;
  }
  fieldset:nth-child(3) { /* 세 번째 fieldset (중량) */
    flex-basis: 20%;
    min-width: 100px;
  }
  fieldset:nth-child(4) { /* 네 번째 fieldset (금액) */
    flex-basis: 40%;
    min-width: 200px;
  }

  /* ✅ legend 스타일 */
  legend {
    font-size: 15px;
    font-weight: bold;
    text-align: center;
  }
  fieldset:nth-child(4) legend {
    padding-right: 32%;
  }

  /* ✅ select, input 기본 스타일 */
  select, input {
    width: 100%;
    height: 30px;
    padding: 5px;
    font-size: 14px;
    text-align: center;
    box-sizing: border-box;
  }

  /* ✅ 금액 입력 필드 & 버튼 */
  .price-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
  }
  .price {
    flex: 3;
    color: red;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    width: 100%;
  }
  .check-price {
    flex: 1;
    height: 30px;
    padding: 5px 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .check-price:hover {
    background-color: #0056b3;
  }

  /* ✅ 결과 리스트 */
  .result-container {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }
  .result-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 500px;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .result-box .item-info {
    flex-grow: 1;
    text-align: left;
  }
  .result-box .item-price {
    text-align: right;
    min-width: 100px;
    margin-right: 20px;
  }
  .cancel-button {
    background: red;
    width: 60px;
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

  /* ✅ 견적 요청 버튼 */
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

  /* ✅ 📌 반응형 디자인 (모바일 스타일 적용) */
  @media (max-width: 768px) {
    /* 📌 컨테이너 기본 조정 */
    .container {
      width: 90%;
      padding: 10px;
      align-items: center;
    }
    .container h2 {
      font-size: 18px;
    }

    /* 📌 입력 박스 크기 조정 */
    .input-box {
      padding: 15px;
      border-radius: 15px;
    }

    /* 📌 row는 세로 정렬 */
    .row {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }

    /* 📌 fieldset은 가득 차게 */
    fieldset {
      width: 100%;
      max-width: 100%;
      min-width: 0;
    }
    fieldset:nth-child(4) legend {
      padding-right: 5%;
    }

    /* 📌 input, select 크기 조정 */
    select, input {
      width: 100%;
      font-size: 16px;
    }

    /* 📌 price-container 조정 */
    .price-container {
      flex-direction: row;
      align-items: center;
      width: 100%;
    }
    .price {
      width: 100%;
    }
    .check-price {
      width: 100%;
      padding: 8px;
      font-size: 16px;
    }

    /* 📌 결과 박스 중앙 정렬 */
    .result-container {
      align-items: center;
      width: 100%;
    }
    .result-box {
      width: 90%;
      text-align: center;
    }
    .total-sum {
      width: 90%;
      text-align: right;
    }
  }
</style>