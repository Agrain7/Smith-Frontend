<!-- frontend/src/components/Product.vue -->
<template>
  <section class="product-section">
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
          name: "현장용소부재",
          productId: "현장용소부재"
        },
        {
          name: "공장용소부재",
          productId: "공장용소부재"
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
