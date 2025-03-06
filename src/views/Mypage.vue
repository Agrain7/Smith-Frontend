<template>
  <div class="mypage">
    <h1>마이 페이지</h1>
    <table class="orders-table">
      <thead>
        <tr>
          <th>제품명</th>
          <th>프로젝트명</th>
          <th>견적서 확인하기</th>
          <th>주문하기</th>
          <th>진행상황</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.productName }}</td>
          <td>{{ order.projectName }}</td>
          <td>
            <button @click="viewEstimate(order)">견적서 확인하기</button>
          </td>
          <td>
            <button @click="orderNow(order)">주문하기</button>
          </td>
          <td>{{ order.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Mypage",
  data() {
    return {
      // 초기 샘플 데이터; 실제 데이터는 API나 Vuex에서 받아오도록 수정 가능
      orders: [
        { id: 1, productName: "현장용소부재", projectName: "프로젝트 A", status: "견적 전송 완료" },
        { id: 2, productName: "공장용소부재", projectName: "프로젝트 B", status: "견적 전송 완료" },
        { id: 3, productName: "브라켓", projectName: "프로젝트 C", status: "견적 전송 완료" }
      ]
    }
  },
  created() {
    // 이벤트 버스로 새로운 주문 데이터를 받음
    this.$root.$on('orderSubmitted', this.addOrder);
  },
  beforeDestroy() {
    this.$root.$off('orderSubmitted', this.addOrder);
  },
  methods: {
    addOrder(newOrder) {
      this.orders.push(newOrder);
    },
    viewEstimate(order) {
      alert(`제품 ${order.productName}의 견적서를 확인합니다.`);
    },
    orderNow(order) {
      alert(`제품 ${order.productName}을 주문합니다.`);
    }
  }
};
</script>

<style scoped>
.mypage {
  width: 1080px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 14px;
}

.orders-table th,
.orders-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.orders-table th {
  background-color: #f2f2f2;
}

.orders-table button {
  padding: 4px 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.orders-table button:hover {
  background-color: #0056b3;
}
</style>
