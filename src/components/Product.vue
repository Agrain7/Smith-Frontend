<!-- frontend/src/components/Product.vue -->
<template>
  <section class="product-section">
    <h2 class="section-title">주문하기</h2>
    <div class="product-container">
      <div 
        class="product-card" 
        v-for="(product, index) in products" 
        :key="index"
      >
        <a href="#" @click.prevent="goToProductPage(product.productId)">
          <h3 class="product-name">{{ product.name }}</h3>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Product',
  data() {
    return {
      products: [
        {
          name: "현장용 소부재",
          productId: "현장용 소부재"
        },
        {
          name: "공장용 소부재",
          productId: "공장용 소부재"
        },
        {
          name: "브라켓",
          productId: "브라켓"
        }
      ]
    }
  },
  methods: {
    goToProductPage(productId) {
      this.$router.push(`/product/${encodeURIComponent(productId)}`);
    }
  }
}
</script>

<style scoped>
.product-section {
  width: 100%;
  max-width: 1912px;
  margin: 20px auto;
  padding: 20px;
  box-sizing: border-box;
}

.section-title {
  text-align: left;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

.product-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  background-color: #fff;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}
</style>
