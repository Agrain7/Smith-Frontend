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
  transition: all 0.3s ease; /* 부드러운 크기 변화 효과 */
}

/* 상단 영역: 부모를 relative로 설정 */
.banner-top {
  position: relative;
  height: 60px;
  background-color: #ddd;
}

/* 하단 영역도 상단과 동일하게 relative로 설정 */
.banner-bottom {
  position: relative;
  height: 60px;
  background-color: #ddd;
  margin-top: 20px;
}

/* 좌측, 우측 콘텐츠: 부모 기준 절대 위치 지정 */
.left-content,
.right-content {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

/* 좌측 콘텐츠: 중앙 기준에서 200px 왼쪽 */
.left-content {
  left: calc(50% - 200px);
  text-align: left;
}

/* 우측 콘텐츠: 중앙 기준에서 200px 오른쪽 */
.right-content {
  right: calc(50% - 200px);
  text-align: right;
}

/* 가운데 영역: 내용 없음, 높이만 지정 */
.banner-middle {
  height: 20px;
  background-color: #fff;
  margin-top: 20px;
}

/* 기본 텍스트 스타일 */
.text {
  font-weight: bold;
  margin: 4px 0;
}

/* 왼쪽 텍스트 크기 */
.left-content .text {
  font-size: 20px;
}

/* 오른쪽 텍스트 크기 */
.right-content .text {
  font-size: 16px;
}

/* 다크 모드 설정 */
@media (prefers-color-scheme: dark) {
  .banner-middle {
    background-color: #000;
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
