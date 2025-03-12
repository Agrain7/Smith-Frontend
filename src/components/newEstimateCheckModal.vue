<template>
    <teleport to="body">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <!-- 본문 텍스트 -->
          <div class="text-content">
            <p>안녕하세요 
                <img src="@/assets/logo.png" alt="smith" class="inline-logo">
                소부재 플랫폼을 이용해주셔서 감사합니다.</p>
            <p>아래 연결된 카카오톡 오픈 채팅방을 통해서 세부견적 관련하여 안내 받으실 수 있습니다.</p>
            <p>
              세부 견적 요청 자료(dwg, excel 파일 등)를 올려주시면<br />
              담당자 확인 후 답변 드리도록 하겠습니다.
            </p>
          </div>
  
          <!-- 하단 영역: 오른쪽 정렬 -->
          <div class="footer-actions">
            <!-- 세부견적 요청하러 가기 (링크) -->
            <p class="estimate-link">
              <a href="http://pf.kakao.com/_jxmXnn/chat" target="_blank" rel="noopener noreferrer">
                세부견적 요청하러 가기
              </a>
            </p>
            <!-- 닫기 버튼 (링크 아래) -->
            <button class="close-btn" @click="closeModal">닫기</button>
          </div>
        </div>
      </div>
    </teleport>
  </template>
  
  <script>
  export default {
    name: "newEstimateCheckModal",
    props: {
      isOpen: Boolean,
      userData: Object
    },
    emits: ["close"],
    methods: {
      closeModal() {
        this.$emit("close");
      }
    }
  };
  </script>
  
  <style scoped>
  /* 모달 오버레이: 뒷배경 어둡게 */
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
  
  /* 모달 박스 */
  .modal-container {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 500px; /* 모달 가로 폭 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    font-family: "Malgun Gothic", sans-serif; /* 한글 폰트 */
    line-height: 1.6;
    text-align: left; /* 본문 텍스트는 왼쪽 정렬 */
  }
  
  /* 본문 텍스트 */
  .text-content p {
    margin: 1em -1em;
    font-size: 16px;
    color: #333;
  }
  
  /* 하단 영역: 오른쪽 정렬 */
  .footer-actions {
    margin-top: 20px;
    text-align: right; /* 내부 요소를 오른쪽 정렬 */
  }
  
  /* 링크 스타일 */
  .estimate-link {
    margin-bottom: 10px; /* 링크와 버튼 사이 간격 */
  }
  .estimate-link a {
    color: #0078d7;
    font-weight: bold;
    text-decoration: underline;
    transition: color 0.2s;
  }
  .estimate-link a:hover {
    color: #0056b3;
  }
  
  /* 닫기 버튼 */
  .close-btn {
    padding: 8px 16px;
    background-color: #0078d7;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .close-btn:hover {
    background-color: #0056b3;
  }

  .inline-logo {
  height: 1em;          /* 텍스트와 동일한 높이로 조정 */
  vertical-align: middle; /* 텍스트 중앙에 정렬 */
  margin: 0 0.01em;       /* 좌우 간격 조정 (선택 사항) */
  transform: translateY(-4px); /* 이미지 위치를 위로 2px 이동 */
}
  </style>
  