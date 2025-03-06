<template>
  <div class="admin-panel">
    <h1>관리자 페이지</h1>
    <!-- 탭 메뉴 -->
    <div class="tabs">
      <button 
        :class="{ active: currentTab === 'members' }" 
        @click="currentTab = 'members'">
        회원관리
      </button>
      <button 
        :class="{ active: currentTab === 'prices' }" 
        @click="currentTab = 'prices'">
        오늘의 가격 관리
      </button>
      <button 
        :class="{ active: currentTab === 'estimates' }" 
        @click="currentTab = 'estimates'">
        프로젝트 및 견적서 전송
      </button>
      <button 
        :class="{ active: currentTab === 'completed' }" 
        @click="currentTab = 'completed'">
        완료 프로젝트
      </button>
    </div>

    <div class="tab-content">
      <!-- 회원관리 탭 (생략) -->
      <div v-if="currentTab === 'members'">
        <!-- 회원관리 테이블 코드 -->
      </div>

      <!-- 오늘의 가격 관리 탭 (생략) -->
      <div v-if="currentTab === 'prices'" class="price-management">
        <!-- 가격 관리 관련 코드 -->
      </div>

      <!-- 프로젝트 및 견적서 전송 탭 -->
      <div v-if="currentTab === 'estimates'">
        <table class="orders-table">
          <thead>
            <tr>
              <th>부재종류</th>
              <th>아이디</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>프로젝트명</th>
              <th>견적요청 파일</th>
              <th>견적서 전송하기</th>
              <th>프로젝트 완료</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in pendingEstimates" :key="order._id">
              <td>{{ order.productType }}</td>
              <td>{{ order.username }}</td>
              <td>{{ order.name }}</td>
              <td>{{ order.phone }}</td>
              <td>{{ order.projectName }}</td>
              <td>
                <a href="#" @click.prevent="downloadFile(order)">파일 다운로드</a>
              </td>
              <td>
                <input type="file" @change="handleFileChange($event, order)" />
                <button @click="sendEstimate(order)">전송</button>
              </td>
              <td>
                <button @click="completeProject(order)">완료</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 완료 프로젝트 탭 (생략) -->
      <div v-if="currentTab === 'completed'">
        <!-- 완료 프로젝트 테이블 코드 -->
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';

const swalWithCenter = Swal.mixin({
  position: 'center'
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default {
  name: "AdminPanel",
  data() {
    return {
      currentTab: 'members',
      users: [],
      estimates: [],
      localPriceConfig: {
        "비규격": {
          "9t이하": 800,
          "12~50t": 1000
        },
        "중국산": {
          "9t이하": 900,
          "12~50t": 1100
        },
        "SM275": {
          "9t이하": 1000,
          "12~50t": 1200
        },
        "SM355": {
          "9t이하": 1100,
          "12~50t": 1300
        },
        processingFee: {
          "스플라이스 철판": 180,
          "일반 철판": 160
        }
      },
      orders: []  // 전체 주문 목록
    }
  },
  computed: {
    pendingEstimates() {
      // 견적 요청 상태가 "견적 요청 전송 완료"인 주문
      return this.estimates.filter(estimate => estimate.status === "견적 요청 전송 완료");
    },
    completedEstimates() {
      return this.estimates.filter(estimate => estimate.completed);
    }
  },
  methods: {
    async fetchUsers() {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/users`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.users) {
          this.users = data.users;
        } else {
          console.error("회원 정보 불러오기 오류:", data);
          swalWithCenter.fire({
            icon: 'error',
            title: '오류',
            text: '회원 정보를 불러오는데 실패했습니다.'
          });
        }
      } catch (err) {
        console.error("회원 정보 불러오기 오류:", err);
        swalWithCenter.fire({
          icon: 'error',
          title: '오류',
          text: '회원 정보를 불러오는데 실패했습니다.'
        });
      }
    },
    async fetchEstimates() {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/estimate-request`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          this.estimates = data.estimates;
        } else {
          console.error("견적 요청 데이터 불러오기 오류:", data);
          swalWithCenter.fire({
            icon: 'error',
            title: '오류',
            text: '견적 요청 데이터를 불러오는데 실패했습니다.'
          });
        }
      } catch (err) {
        console.error("견적 요청 데이터 불러오기 오류:", err);
        swalWithCenter.fire({
          icon: 'error',
          title: '오류',
          text: '견적 요청 데이터를 불러오는데 실패했습니다.'
        });
      }
    },
    async fetchOrders() {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success && data.orders) {
          // 모든 주문을 불러온 후 estimates 배열에도 업데이트
          this.orders = data.orders;
          this.estimates = data.orders;
        } else {
          console.error("주문 데이터 불러오기 오류:", data);
        }
      } catch (error) {
        console.error("주문 데이터 불러오기 중 오류 발생:", error);
      }
    },
    handleFileChange(event, order) {
      const file = event.target.files[0];
      if (file) {
        // 각 주문에 선택한 파일을 저장합니다.
        this.$set(order, 'selectedFile', file);
      } else {
        alert("파일을 선택하세요.");
      }
    },
    async sendEstimate(order) {
      if (!order.selectedFile) {
        alert("파일을 선택하세요.");
        return;
      }
      const apiUrl = API_URL;
      const formData = new FormData();
      formData.append('estimateFile', order.selectedFile);
      formData.append('projectName', order.projectName);
      formData.append('productType', order.productType);

      try {
        // 파일 업로드
        const uploadResponse = await axios.post(`${apiUrl}/api/upload-estimate`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const uploadData = uploadResponse.data;
        if (!uploadData.success) {
          alert("파일 업로드 실패: " + uploadData.message);
          return;
        }
        // 상태 업데이트: 해당 주문의 상태를 "견적서 전송 완료"로 변경
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const updateResponse = await axios.put(`${apiUrl}/api/orders/${order._id}/status`, 
          { status: "견적서 전송 완료" },
          { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } }
        );
        const updateData = updateResponse.data;
        if (updateData.success) {
          alert("견적서 전송 완료");
          order.status = updateData.order.status;
        } else {
          alert("주문 상태 업데이트 실패: " + updateData.message);
        }
      } catch (error) {
        console.error("견적서 전송 중 오류:", error);
        alert("전송 중 오류 발생");
      }
    },
    async completeProject(order) {
      const result = await swalWithCenter.fire({
        title: '프로젝트 완료 처리',
        text: '해당 프로젝트를 완료 처리하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '완료 처리',
        cancelButtonText: '취소'
      });
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/api/estimate-request/${order._id}/complete`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
          });
          const data = await res.json();
          if (data.success) {
            await swalWithCenter.fire({
              icon: 'success',
              title: '완료 처리',
              text: '프로젝트가 완료 처리되었습니다.'
            });
            this.fetchEstimates();
          } else {
            await swalWithCenter.fire({
              icon: 'error',
              title: '오류',
              text: data.message || '프로젝트 완료 처리에 실패했습니다.'
            });
          }
        } catch (err) {
          console.error("프로젝트 완료 처리 오류:", err);
          swalWithCenter.fire({
            icon: 'error',
            title: '오류',
            text: '프로젝트 완료 처리 중 오류 발생'
          });
        }
      }
    },
    async deleteEstimate(estimateId) {
      const result = await swalWithCenter.fire({
        title: '정말 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/api/estimate-request/${estimateId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
          });
          const data = await res.json();
          await swalWithCenter.fire({
            icon: 'success',
            title: '삭제 완료',
            text: data.message || '삭제되었습니다.'
          });
          this.fetchEstimates();
        } catch (err) {
          console.error("견적 삭제 오류:", err);
          swalWithCenter.fire({
            icon: 'error',
            title: '오류',
            text: '견적 삭제에 실패했습니다.'
          });
        }
      }
    },
    downloadFile(estimate) {
      const link = document.createElement('a');
      link.href = estimate.fileUrl;
      link.download = estimate.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async savePriceConfig() {
      try {
        const res = await fetch(`${API_URL}/api/price-config`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.localPriceConfig)
        });
        const data = await res.json();
        if (data.success) {
          await swalWithCenter.fire({
            icon: 'success',
            title: '저장 완료',
            text: '오늘의 가격 정보가 업데이트되었습니다.'
          });
          this.$store.commit('updatePriceConfig', this.localPriceConfig);
        } else {
          await swalWithCenter.fire({
            icon: 'error',
            title: '오류',
            text: '가격 설정 업데이트에 실패했습니다.'
          });
        }
      } catch (error) {
        console.error("가격 설정 업데이트 오류:", error);
      }
    },
    async fetchPriceConfig() {
      try {
        const res = await fetch(`${API_URL}/api/price-config`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success && data.config) {
          this.localPriceConfig = data.config;
        }
      } catch (error) {
        console.error("가격 설정 불러오기 오류:", error);
      }
    },
    checkEstimateStatus() {
      if (!this.isLoggedIn) return;
      const username = this.currentUserData.username;
      const projectName = this.product.name;
      fetch(`${API_URL}/api/estimate-request?username=${encodeURIComponent(username)}&projectName=${encodeURIComponent(projectName)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.estimates && data.estimates.length > 0) {
            const estimate = data.estimates[0];
            this.uploadStatus = estimate.fileSubmitted ? '견적파일 제출완료' : '견적파일 미제출';
          } else {
            this.uploadStatus = '견적파일 미제출';
          }
        })
        .catch(error => {
          console.error("견적 요청 상태 확인 오류:", error);
          this.uploadStatus = '견적파일 미제출';
        });
    }
  },
  mounted() {
    this.fetchUsers();
    this.fetchEstimates();
    this.fetchPriceConfig();
    this.checkEstimateStatus();
  }
};
</script>

<style scoped>
.admin-panel {
  width: 100%;
  max-width: 1080px;
  margin: 20px auto;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #f2f2f2;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, transform 0.3s;
}
.tabs button.active {
  background-color: #007bff;
  color: #fff;
  transform: scale(1.05);
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 14px;
}
.orders-table th,
.orders-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.orders-table th {
  background-color: #f2f2f2;
}
.orders-table button {
  padding: 4px 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 5px;
}
.orders-table button:hover {
  background-color: #0056b3;
}
.detail-estimate-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background-color: #f0f0f0;
}
.progress-status {
  text-align: right;
  font-size: 16px;
  color: #333;
}
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
}
.buy-button {
  width: 50%;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid #007bff;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
}
.buy-button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

/* 오늘의 가격 관리 탭 스타일 */
.price-management {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.price-management h2 {
  margin-bottom: 20px;
}

.price-management .form-group {
  margin-bottom: 15px;
}

.price-management label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.price-management input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.price-management button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}
</style>
