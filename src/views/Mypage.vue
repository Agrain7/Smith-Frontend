<template>
    <div class="mypage">
      <h1>완료된 거래 내역</h1>
      <div v-if="completedTransactions.length">
        <div class="transaction" v-for="tx in completedTransactions" :key="tx.id">
          <h2>{{ tx.productName }}</h2>
          <p>거래 수량: {{ tx.quantity }}</p>
          <p>최종 가격: {{ tx.finalPrice }} 원</p>
          <p>거래 완료 날짜: {{ tx.completedDate }}</p>
          <p>기타 정보: {{ tx.notes }}</p>
        </div>
      </div>
      <div v-else>
        <p>완료된 거래 내역이 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Mypage",
    data() {
      return {
        // 샘플 데이터: 실제 구현 시 API 호출 등을 통해 동적으로 받아올 수 있음.
        completedTransactions: [
          {
            id: 1,
            productName: "부재 A",
            quantity: 10,
            finalPrice: 480000,
            completedDate: "2025-01-15",
            notes: "할인 적용, 원활한 거래 완료",
          },
          {
            id: 2,
            productName: "부재 C",
            quantity: 7,
            finalPrice: 350000,
            completedDate: "2025-02-01",
            notes: "추가 요청사항 반영",
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .mypage {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .transaction {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .transaction h2 {
    margin: 0 0 10px;
    font-size: 20px;
    color: #28a745;
  }
  
  .transaction p {
    margin: 5px 0;
    font-size: 14px;
  }
  </style>
  