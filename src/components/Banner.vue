<!-- frontend/src/components/Banner.vue -->
<template>
  <div class="banner">
    <!-- 위측 영역 -->
    <div class="banner-top">
      <div class="left-content">
        <p class="text">오늘의 철강가격</p>
      </div>
      <div class="right-content">
        <p class="text">SM275 : {{ priceConfig.sm275 }}원/kg</p>
        <p class="text">SM355 : {{ priceConfig.sm355 }}원/kg</p>
      </div>
    </div>
    <!-- 가운데 영역 (빈 공간, 페이지 배경색과 동일) -->
    <div class="banner-middle"></div>
    <!-- 아래측 영역 -->
    <div class="banner-bottom">
      <div class="left-content">
        <p class="text">오늘의 가공비</p>
      </div>
      <div class="right-content">
        <p class="text">현장용소부재 : {{ priceConfig.processingFee['현장용소부재'] }}원/kg</p>
        <p class="text">공장용소부재 : {{ priceConfig.processingFee['공장용소부재'] }}원/kg</p>
        <p class="text">브라켓 : {{ priceConfig.processingFee['브라켓'] }}원/kg</p>
      </div>
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
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px 0;
  box-sizing: border-box;
  background-color: #ddd;
}

/* 위측 영역: 동일한 높이 지정 */
.banner-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 300px;
  height: 60px;
  background-color: #ddd;
}

/* 아래측 영역: 동일한 높이 지정 */
.banner-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 300px;
  margin-top: 20px;
  height: 60px;
  background-color: #ddd;
}

/* 가운데 영역: 내용은 없으며, 높이만 지정, 배경은 페이지 배경색과 동일 */
.banner-middle {
  height: 20px;
  background-color: #fff;
  margin-top: 20px;
}

.left-content,
.right-content {
  flex: 1;
}

.left-content {
  text-align: left;
}

.right-content {
  text-align: right;
}

/* 기본 텍스트 스타일 */
.text {
  font-weight: bold;
  margin: 4px 0;
}

/* 왼쪽 영역 텍스트 */
.left-content .text {
  font-size: 20px;
}

/* 오른쪽 영역 텍스트 */
.right-content .text {
  font-size: 16px;
}

/* 다크 모드 설정 */
@media (prefers-color-scheme: dark) {
  .banner-middle {
    background-color: #333;
  }
  .banner-top,
  .banner-bottom {
    background-color: #444;
  }
  .left-content .text,
  .right-content .text {
    color: #fff;
  }
}
</style>
