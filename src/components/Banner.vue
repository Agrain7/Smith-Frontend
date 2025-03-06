<template>
  <div class="banner">
    <!-- 제목 영역 -->
    <div class="banner-header">
      <h2>오늘의 철판가격</h2>
    </div>
    <!-- 가격 표 영역 -->
    <table class="price-table">
      <thead>
        <tr>
          <th></th>
          <th>비규격</th>
          <th>중국산</th>
          <th>SM275</th>
          <th>SM355</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>12~50t</td>
          <td>
            {{ priceConfig["비규격"]["12~50t"] }}원/kg
            <input type="number" v-model.number="orderQuantities['비규격_12~50t']" min="0" />
          </td>
          <td>
            {{ priceConfig["중국산"]["12~50t"] }}원/kg
            <input type="number" v-model.number="orderQuantities['중국산_12~50t']" min="0" />
          </td>
          <td>
            {{ priceConfig["SM275"]["12~50t"] }}원/kg
            <input type="number" v-model.number="orderQuantities['SM275_12~50t']" min="0" />
          </td>
          <td>
            {{ priceConfig["SM355"]["12~50t"] }}원/kg
            <input type="number" v-model.number="orderQuantities['SM355_12~50t']" min="0" />
          </td>
        </tr>
        <tr>
          <td>9t이하</td>
          <td>
            {{ priceConfig["비규격"]["9t이하"] }}원/kg
            <input type="number" v-model.number="orderQuantities['비규격_9t이하']" min="0" />
          </td>
          <td>
            {{ priceConfig["중국산"]["9t이하"] }}원/kg
            <input type="number" v-model.number="orderQuantities['중국산_9t이하']" min="0" />
          </td>
          <td>
            {{ priceConfig["SM275"]["9t이하"] }}원/kg
            <input type="number" v-model.number="orderQuantities['SM275_9t이하']" min="0" />
          </td>
          <td>
            {{ priceConfig["SM355"]["9t이하"] }}원/kg
            <input type="number" v-model.number="orderQuantities['SM355_9t이하']" min="0" />
          </td>
        </tr>
      </tbody>
    </table>
    <p class="loss-note">※ 로스율 5% 적용</p>

    <!-- 구분 영역 -->
    <div class="separator"></div>

    <!-- 가공비 영역 -->
    <div class="processing-fee">
      <h3>오늘의 가공비</h3>
      <p>스플라이스 철판: {{ priceConfig.processingFee['스플라이스 철판'] }}원/kg</p>
      <p>일반 철판: {{ priceConfig.processingFee['일반 철판'] }}원/kg</p>
      <p class="loss-note">
        ※ 중량기준 : 사각환산중량(<img src="@/assets/square.png" alt="square" class="square-icon" />)
      </p>
    </div>

    <!-- 예상 가격 영역 (원하는 경우 추가) -->
    <div class="price-display">
      <p class="expected-price">예상가격:</p>
      <p class="product-price">{{ computedPriceFormatted }}원</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Banner",
  computed: {
    priceConfig() {
      return this.$store.state.priceConfig;
    },
    computedPrice() {
      // 모든 옵션의 (가격 * 주문수량)를 합산
      let sum = 0;
      for (const material of this.materials) {
        for (const weight of this.weightCategories) {
          const key = material + '_' + weight;
          const qty = this.orderQuantities[key] || 0;
          const price = this.priceConfig[material][weight] || 0;
          sum += price * qty;
        }
      }
      // 가공비는 별도(여기서는 단순히 더하지 않고 처리하지 않음)
      return sum * 1000;
    },
    computedPriceFormatted() {
      return this.computedPrice.toLocaleString('ko-KR');
    }
  },
  data() {
    return {
      // 재료 목록와 무게 카테고리
      materials: ["비규격", "중국산", "SM275", "SM355"],
      weightCategories: ["12~50t", "9t이하"],
      // 주문수량 객체, 기본값: 비규격_12~50t는 1, 나머지는 0
      orderQuantities: {
        "비규격_12~50t": 1,
        "비규격_9t이하": 0,
        "중국산_12~50t": 0,
        "중국산_9t이하": 0,
        "SM275_12~50t": 0,
        "SM275_9t이하": 0,
        "SM355_12~50t": 0,
        "SM355_9t이하": 0
      }
    }
  }
}
</script>

<style scoped>
.banner {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ddd;
  transition: all 0.3s ease;
}
.banner-header {
  text-align: center;
  margin-bottom: 20px;
}
.price-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.price-table th,
.price-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}
.processing-fee {
  text-align: center;
}
.processing-fee h3 {
  margin-bottom: 10px;
}
.separator {
  height: 40px;
  background-color: #fff;
  margin: 20px 0;
  width: calc(100% + 40px);
  margin-left: -20px;
}
.square-icon {
  width: 1em;
  height: auto;
  vertical-align: middle;
}

/* 추가 스타일: 예상가격 영역 */
.price-display {
  text-align: center;
  margin-top: 20px;
}
.expected-price {
  font-size: 18px;
  font-weight: bold;
}
.product-price {
  font-size: 22px;
  font-weight: bold;
  color: #d9534f;
  margin: 0;
}

</style>
