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
    <td>{{ priceConfig["비규격"]["12~50t"] }}원/kg</td>
    <td>{{ priceConfig["중국산"]["12~50t"] }}원/kg</td>
    <td>{{ priceConfig["SM275"]["12~50t"] }}원/kg</td>
    <td>{{ priceConfig["SM355"]["12~50t"] }}원/kg</td>
  </tr>
  <tr>
    <td>9t이하</td>
    <td>{{ priceConfig["비규격"]["9t이하"] }}원/kg</td>
    <td>{{ priceConfig["중국산"]["9t이하"] }}원/kg</td>
    <td>{{ priceConfig["SM275"]["9t이하"] }}원/kg</td>
    <td>{{ priceConfig["SM355"]["9t이하"] }}원/kg</td>
  </tr>
</tbody>
    </table>
    <p class="loss-note">※ 로스율 5% 적용</p>

    <!-- 구분 영역 -->
<div class="separator"></div>

    <!-- 가공비 영역 -->
    <div class="processing-fee">
  <h3>오늘의 가공비</h3>
  <!-- 스플라이스 철판을 두 번 보여주려면, 같은 값을 두 번 출력 -->
  <p>스플라이스 철판: {{ priceConfig.processingFee['스플라이스 철판'] }}원/kg</p>
  <p>일반 철판: {{ priceConfig.processingFee['일반 철판'] }}원/kg</p>
  <p class="loss-note">
  ※ 중량기준 : 사각환산중량(<img src="@/assets/square.png" alt="square" class="square-icon" />)
</p>
</div>

  </div>
</template>

<script>
export default {
  name: "Banner",
  computed: {
    priceConfig() {
      return this.$store.state.priceConfig;
    }
  }
}
</script>

<style scoped>
.banner {
  width: 100%;
  max-width: 1912px;
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
  height: 40px;           /* 원하는 높이로 조정 */
  background-color: #fff; /* 부모 배경과 대비되는 색상으로 설정 (예: 흰색) */
  margin: 20px 0;         /* 위아래 여백 */
  width: calc(100% + 40px); /* 좌우 padding 20px씩 보정 */
  margin-left: -20px;   
}
.square-icon {
  width: 1em;      /* 글자 크기에 맞게 1em로 설정 */
  height: auto;    /* 비율에 맞게 자동 조절 */
  vertical-align: middle;  /* 텍스트와 수평 정렬 */
}
</style>
