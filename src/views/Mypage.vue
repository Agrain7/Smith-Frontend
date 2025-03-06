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
        <tr v-for="order in orders" :key="order._id">
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
      orders: [] // 초기 샘플 데이터를 제거하고 빈 배열로 시작
    }
  },
  created() {
    // 이벤트 버스를 통해 새로운 주문 데이터 수신 (실시간 업데이트)
    this.$root.$on('orderSubmitted', this.addOrder);
    // 로그인한 사용자 기준으로 백엔드에서 주문 데이터를 가져옵니다.
    this.fetchOrders();
  },
  beforeDestroy() {
    this.$root.$off('orderSubmitted', this.addOrder);
  },
  methods: {
    async fetchOrders() {
      const token = this.$store.state.token || localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;
      
      // JWT 토큰에서 사용자 아이디(username) 추출
      let username = "";
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payload))));
        username = decoded.username;
      } catch (error) {
        console.error("토큰 파싱 오류:", error);
      }
      
      try {
        const response = await fetch(`https://smithapp-bbc6f2929f0b.herokuapp.com/api/orders?username=${encodeURIComponent(username)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.orders) {
          this.orders = data.orders;
        } else {
          console.error("주문 데이터 불러오기 오류:", data);
        }
      } catch (error) {
        console.error("주문 데이터 불러오기 중 오류 발생:", error);
      }
    },
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
