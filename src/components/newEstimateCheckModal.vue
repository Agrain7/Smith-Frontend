<!-- frontend/src/components/newEstimateCheckModal.vue -->
<template>
    <teleport to="body">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <h2>견적서 확인</h2>
          <button class="close-btn" @click="closeModal">닫기</button>
        </div>
      </div>
    </teleport>
</template>
  
<script>
    export default {
        name: "newEstimateCheckModal",
        props: {
            isOpen: Boolean,
            userData: Object  // ✅ userData를 props로 추가
        },
        emits: ["close"], // 부모 컴포넌트에 모달 닫기 이벤트 전달
        computed: {
        
        },
        methods: {
            closeModal() {
                this.$emit("close"); // 모달 닫기 이벤트
            }
        }
    };
</script>
  
<style scoped>
    /* ✅ 모달 오버레이 */
    .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    }

    /* ✅ 모달 박스 */
    .modal-container {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
</style>
  