<template>
    <div class="basket-page">
      <h1>진행중인 구매 목록</h1>
      <div v-if="orders.length">
        <div class="order" v-for="order in orders" :key="order.id">
          <h2>{{ order.productName }}</h2>
          <p>주문 수량: {{ order.quantity }}</p>
          <p>예상 가격: {{ order.estimatedPrice }} 원</p>
          <p>견적 파일 진행 상황: {{ order.estimateStatus }}</p>
          <p>세부 견적 파일 진행 상황: {{ order.detailEstimateStatus }}</p>
        </div>
      </div>
      <div v-else>
        <p>진행중인 구매가 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Basket",
    data() {
      return {
        // 샘플 데이터: 실제 구현 시 API로부터 받아오거나 Vuex 등으로 관리
        orders: [
          {
            id: 1,
            productName: "부재 A",
            quantity: 10,
            estimatedPrice: 500000,
            estimateStatus: "진행중", // 예: 견적파일 업로드 진행 중
            detailEstimateStatus: "파일 검토 중",
          },
          {
            id: 2,
            productName: "부재 B",
            quantity: 5,
            estimatedPrice: 300000,
            estimateStatus: "완료",
            detailEstimateStatus: "확인 완료",
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .basket-page {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .order {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .order h2 {
    margin: 0 0 10px;
    font-size: 20px;
    color: #007bff;
  }
  
  .order p {
    margin: 5px 0;
    font-size: 14px;
  }
  </style>
  