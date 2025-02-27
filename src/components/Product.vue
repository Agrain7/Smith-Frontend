<!-- frontend/src/components/Product.vue -->

<template>
  <section class="product-section">
    <div class="product-container">
      <div 
        class="product-card" 
        v-for="(product, index) in products" 
        :key="index"
      >
        <!-- 이미지 클릭 시 goToProductPage 메서드를 호출 -->
        <a href="#" @click.prevent="goToProductPage(product.productId)">
          <img 
            :src="product.image" 
            :alt="product.name" 
            class="product-image" 
          />
        </a>
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import product1 from '@/assets/product1.webp';
import product2 from '@/assets/product2.webp';
import product3 from '@/assets/product3.webp';
import product4 from '@/assets/product4.webp';
import product5 from '@/assets/product5.webp';
import product6 from '@/assets/product6.webp';

export default {
  name: 'Product',
  data() {
    return {
      products: [
        {
          image: product1,
          name: "현장용소부재",
          description: "현장용소부재에 대한 간단한 설명입니다.",
          productId: "현장용소부재"  // 동적 라우트 파라미터로 사용 (URL: /product/현장용소부재)
        },
        {
          image: product2,
          name: "공장용소부재",
          description: "공장용소부재에 대한 간단한 설명입니다.",
          productId: "공장용소부재"
        },
        {
          image: product3,
          name: "철판",
          description: "철판에 대한 간단한 설명입니다.",
          productId: "철판"
        },
        {
          image: product4,
          name: "브라켓",
          description: "브라켓에 대한 간단한 설명입니다.",
          productId: "브라켓"
        },
        {
          image: product5,
          name: "볼트",
          description: "볼트에 대한 간단한 설명입니다.",
          productId: "볼트"
        },
        {
          image: product6,
          name: "야",
          description: "야 제품에 대한 간단한 설명입니다.",
          productId: "야"
        }
      ]
    }
  },
  methods: {
    goToProductPage(productId) {
      // 동적 라우트로 이동 (라우터 설정: path: '/product/:productId')
      this.$router.push(`/product/${encodeURIComponent(productId)}`);
    }
  }
}
</script>

<style scoped>
.product-section {
  width: 100%;
  width: 1080px;
  margin: 20px auto;
  padding: 20px;
  box-sizing: border-box;
}

.product-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  background-color: #fff;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: auto;
  display: block;
}

.product-name {
  font-size: 18px;
  margin: 10px 0 5px;
  font-weight: bold;
}

.product-description {
  font-size: 14px;
  color: #555;
}
</style>
