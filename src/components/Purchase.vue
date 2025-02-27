<!-- frontend/src/components/Purchase.vue -->

<template>
    <div class="purchase-container">
      <h1>구매 정보 입력</h1>
      <form @submit.prevent="submitPurchase">
        <!-- 구매자 정보 -->
        <fieldset>
          <legend>구매자 정보</legend>
          <label>
            이름:
            <input type="text" v-model="buyer.name" required />
          </label>
          <label>
            이메일:
            <input type="email" v-model="buyer.email" required />
          </label>
          <label>
            휴대폰번호:
            <input type="tel" v-model="buyer.phone" required />
          </label>
        </fieldset>
        
        <!-- 배송지 -->
        <fieldset>
          <legend>배송지</legend>
          <label>
            배송주소:
            <input type="text" v-model="shipping.address" required />
          </label>
          <label>
            연락처:
            <input type="tel" v-model="shipping.contact" required />
          </label>
          <label>
            배송요청사항:
            <textarea v-model="shipping.request"></textarea>
          </label>
        </fieldset>
        
        <!-- 결제 정보 -->
        <fieldset>
          <legend>결제 정보</legend>
          <label>
            상품가격:
            <input type="number" v-model.number="payment.productPrice" readonly />
          </label>
          <label>
            배송비:
            <input type="number" v-model.number="payment.shippingCost" readonly />
          </label>
          <label>
            결제금액:
            <input type="number" v-model.number="payment.total" readonly />
          </label>
          <label>
            결제방법:
            <select v-model="payment.method">
              <option value="card">신용카드</option>
              <option value="bank">무통장 입금</option>
            </select>
          </label>
        </fieldset>
        
        <button type="submit">구매 완료</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Purchase',
    data() {
      return {
        buyer: {
          name: '',
          email: '',
          phone: '',
        },
        shipping: {
          address: '',
          contact: '',
          request: '',
        },
        payment: {
          productPrice: 0, // 구매 페이지 열릴 때 URL 파라미터로 전달받거나 직접 설정
          shippingCost: 0, // 예를 들어 3000원 고정
          total: 0,
          method: 'card',
        },
      };
    },
    created() {
      // 예시: URL의 쿼리 파라미터를 이용해서 상품가격과 배송비를 설정
      const params = new URLSearchParams(window.location.search);
      this.payment.productPrice = Number(params.get('price')) || 0;
      this.payment.shippingCost = Number(params.get('shipping')) || 0;
      this.payment.total = this.payment.productPrice + this.payment.shippingCost;
    },
    methods: {
      submitPurchase() {
        // 구매 완료 로직 (실제 서비스에서는 결제 API 연동 등 진행)
        alert('구매가 완료되었습니다.');
        // 구매 완료 후 팝업 창을 닫습니다.
        window.close();
      },
    },
  };
  </script>
  
  <style scoped>
  .purchase-container {
    width: 600px;
    margin: 20px auto;
    padding: 20px;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    border: 1px solid #ddd;
    background-color: #fff;
  }
  
  fieldset {
    margin-bottom: 20px;
    border: 1px solid #ddd;
    padding: 10px;
  }
  
  legend {
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    box-sizing: border-box;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  