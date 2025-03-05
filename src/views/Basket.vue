<!-- frontend/src/views/Basket.vue -->
<template>
  <div class="basket">
    <h1>장바구니</h1>
    <table class="basket-table">
      <thead>
        <tr>
          <th>제품명</th>
          <th>수량</th>
          <th>가격 (원)</th>
          <th>합계 (원)</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item.id">
          <td>{{ item.productName }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.price }}</td>
          <td>{{ (item.price * item.quantity).toLocaleString('ko-KR') }}</td>
          <td>
            <button @click="removeItem(item.id)">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Basket",
  data() {
    return {
      // 샘플 장바구니 데이터; 실제 데이터는 API나 Vuex에서 받아오도록 수정
      cartItems: [
        { id: 1, productName: "현장용소부재", quantity: 2, price: 50000 },
        { id: 2, productName: "공장용소부재", quantity: 1, price: 75000 },
        { id: 3, productName: "브라켓", quantity: 3, price: 30000 }
      ]
    }
  },
  methods: {
    removeItem(id) {
      this.cartItems = this.cartItems.filter(item => item.id !== id);
    }
  }
};
</script>

<style scoped>
.basket {
  width: 1080px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}

.basket-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 14px;
}

.basket-table th,
.basket-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.basket-table th {
  background-color: #f2f2f2;
}

.basket-table button {
  padding: 4px 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.basket-table button:hover {
  background-color: #0056b3;
}
</style>
