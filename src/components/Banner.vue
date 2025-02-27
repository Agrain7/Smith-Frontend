<!-- frontend/src/components/Banner.vue -->

<template>
  <div class="banner">
    <!-- 배너 이미지 (클릭 시 해당 배너의 링크로 이동) -->
    <img 
      :src="currentBanner.image" 
      alt="Banner Image" 
      class="banner-image" 
      @click="goToBannerPage(currentBanner.link)" 
    />

    <!-- 왼쪽 상단 오버레이: 철강 가격 정보 -->
    <div class="banner-overlay">
      <p>오늘의 철강 가격</p>
      <p>SM275 : 1000원/kg</p>
      <p>SM355 : 1200원/kg</p>
      <p>오늘의 가공비 : 199원/kg</p>
    </div>

    <!-- 오른쪽 컨트롤 버튼 영역 -->
    <div class="banner-controls">
      <ul>
        <li 
          v-for="(banner, index) in banners" 
          :key="index"
          :class="{ active: currentIndex === index }"
          @mouseenter="changeBanner(index)"
        >
          <!-- 동적 라우트: /product/제품명 -->
          <router-link :to="`/product/${encodeURIComponent(labels[index])}`">
            <button class="banner-button">{{ labels[index] }}</button>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import banner1 from '@/assets/banner1.jpg'
import banner2 from '@/assets/banner2.jpg'
import banner3 from '@/assets/banner3.jpg'
import banner4 from '@/assets/banner4.jpg'
import banner5 from '@/assets/banner5.jpg'
import banner6 from '@/assets/banner6.jpg'

export default {
  name: "Banner",
  data() {
    return {
      // 6개의 배너 이미지 (링크는 기존대로 유지할 수 있음)
      banners: [
        { image: banner1, link: '/page1' },
        { image: banner2, link: '/page2' },
        { image: banner3, link: '/page3' },
        { image: banner4, link: '/page4' },
        { image: banner5, link: '/page5' },
        { image: banner6, link: '/page6' }
      ],
      // 각 버튼에 들어갈 텍스트: 이 값을 동적 라우트 파라미터로 사용합니다.
      labels: ["현장용소부재", "공장용소부재", "철판", "브라켓", "볼트", "야"],
      currentIndex: 0,
      intervalId: null,
    }
  },
  computed: {
    currentBanner() {
      return this.banners[this.currentIndex];
    }
  },
  methods: {
    changeBanner(index) {
      this.currentIndex = index;
      this.resetInterval();
    },
    startInterval() {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.banners.length;
      }, 5000);
    },
    resetInterval() {
      clearInterval(this.intervalId);
      this.startInterval();
    },
    goToBannerPage(link) {
      if (this.$router) {
        this.$router.push(link);
      } else {
        window.location.href = link;
      }
    }
  },
  mounted() {
    this.startInterval();
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  }
}
</script>

<style scoped>
.banner {
  width: 100%;
  position: relative;
  width: 1080px;       /* 전체 배너 영역 1080px 고정 */
  margin: 0 auto;
  margin-top: 10px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  display: block;
  cursor: pointer;
}

.banner-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border: 1px solid #ddd;
  width: 250px;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  line-height: 1.4;
}

.banner-overlay p {
  margin: 4px 0;
}

.banner-controls {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.banner-controls ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.banner-controls li {
  margin: 5px 0;
}

.banner-button {
  min-width: 120px;
  height: 40px;
  border: 2px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: border-color 0.3s, background-color 0.3s;
}

.banner-button:hover {
  border-color: #aaa;
  background-color: #e0e0e0;
}

.banner-controls li.active .banner-button {
  border-color: #0078d7;
  background-color: #d0e6ff;
}

/* 다크모드 적용: prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  .banner-overlay {
    background-color: rgba(255, 255, 255, 0.9); /* 필요에 따라 조정 */
    color: #000;
  }
  .banner-button {
    border-color: #888;
    background-color: #333;
    color: #fff;
  }
  .banner-button:hover {
    border-color: #aaa;
    background-color: #444;
  }
}
</style>
