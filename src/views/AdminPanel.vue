<!-- frontend/src/views/AdminPanel.vue -->
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
      <!-- 회원관리 탭 -->
      <div v-if="currentTab === 'members'">
        <table>
          <thead>
            <tr>
              <th>아이디</th>
              <th>이름</th>
              <th>휴대폰번호</th>
              <th>가입일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.username }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <button @click="deleteUser(user._id)">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 오늘의 가격 관리 탭 -->
<div v-if="currentTab === 'prices'" class="price-management">
  <h2>오늘의 가격 관리</h2>
  <table>
    <thead>
      <tr>
        <th>항목</th>
        <th>9t이하 (원/kg)</th>
        <th>12~50t (원/kg)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>비규격</td>
        <td>
          <input type="number" v-model.number="localPriceConfig['비규격']['9t이하']" />
        </td>
        <td>
          <input type="number" v-model.number="localPriceConfig['비규격']['12~50t']" />
        </td>
      </tr>
      <tr>
        <td>중국산</td>
        <td>
          <input type="number" v-model.number="localPriceConfig['중국산']['9t이하']" />
        </td>
        <td>
          <input type="number" v-model.number="localPriceConfig['중국산']['12~50t']" />
        </td>
      </tr>
      <tr>
        <td>SM275</td>
        <td>
          <input type="number" v-model.number="localPriceConfig['SM275']['9t이하']" />
        </td>
        <td>
          <input type="number" v-model.number="localPriceConfig['SM275']['12~50t']" />
        </td>
      </tr>
      <tr>
        <td>SM355</td>
        <td>
          <input type="number" v-model.number="localPriceConfig['SM355']['9t이하']" />
        </td>
        <td>
          <input type="number" v-model.number="localPriceConfig['SM355']['12~50t']" />
        </td>
      </tr>
    </tbody>
  </table>
  <!-- 기존 가공비 입력 영역 -->
  <div class="form-group">
  <label>스플라이스 철판 가공비 (원/kg):</label>
  <input type="number" v-model.number="localPriceConfig.processingFee['스플라이스 철판']" />
</div>
<div class="form-group">
  <label>일반 철판 가공비 (원/kg):</label>
  <input type="number" v-model.number="localPriceConfig.processingFee['일반 철판']" />
</div>
  <button @click="savePriceConfig">저장</button>
</div>


      <!-- 프로젝트 및 견적서 전송 탭 -->
      <div v-if="currentTab === 'estimates'">
        <table>
          <thead>
            <tr>
              <th>부재종류</th>
              <th>아이디</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>E-mail</th>
              <th>견적요청 파일</th>
              <th>견적서 전송하기</th>
              <th>프로젝트 완료</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(estimate, index) in pendingEstimates" :key="estimate._id">
              <td>{{ estimate.productType }}</td>
              <td>{{ estimate.username }}</td>
              <td>{{ estimate.name }}</td>
              <td>{{ estimate.phone }}</td>
              <td>{{ estimate.projectName }}</td>
              <td>
                <a href="#" @click.prevent="downloadFile(estimate)">파일 다운로드</a>
              </td>
              <td>
                <button @click="sendEstimate(estimate)">전송</button>
              </td>
              <td>
                <button @click="completeProject(estimate)">완료</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 완료 프로젝트 탭 -->
      <div v-if="currentTab === 'completed'">
        <table>
          <thead>
            <tr>
              <th>부재종류</th>
              <th>아이디</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>프로젝트명</th>
              <th>견적요청 파일</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(estimate, index) in completedEstimates" :key="estimate._id">
              <td>{{ estimate.productType }}</td>
              <td>{{ estimate.username }}</td>
              <td>{{ estimate.name }}</td>
              <td>{{ estimate.phone }}</td>
              <td>{{ estimate.projectName }}</td>
              <td>
                <a href="#" @click.prevent="downloadFile(estimate)">파일 다운로드</a>
              </td>
              <td>
                <button @click="deleteEstimate(estimate._id)">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const swalWithCenter = Swal.mixin({
  position: 'center'
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default {
  name: "AdminPanel",
  data() {
  return {
    currentTab: 'members', // 기본 탭: 회원관리
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
    }
  };
},

  computed: {
    pendingEstimates() {
      return this.estimates.filter(estimate => !estimate.completed);
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
          },
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
    async deleteUser(userId) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const result = await swalWithCenter.fire({
        title: '정말 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/api/users/${userId}`, {
            method: "DELETE",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          });
          const data = await res.json();
          await swalWithCenter.fire({
            icon: 'success',
            title: '삭제 완료',
            text: data.message || '삭제되었습니다.'
          });
          this.fetchUsers();
        } catch (err) {
          console.error("회원 삭제 오류:", err);
          swalWithCenter.fire({
            icon: 'error',
            title: '오류',
            text: '회원 삭제에 실패했습니다.'
          });
        }
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },
    async fetchEstimates() {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/estimate-request`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
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
    async sendEstimate(estimate) {
      // swalWithCenter.fire({
      //   icon: 'info',
      //   title: '알림',
      //   text: '견적서 전송 기능은 현재 미구현 상태입니다.'
      // });
      try {
        const res = await fetch(`${API_URL}/api/estimate-request/${estimate._id}/send`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        if (data.success) {
          estimate.isSent = true; // 상태 변경
          await swalWithCenter.fire({
            icon: 'success',
            title: '전송 완료',
            text: '견적서가 성공적으로 전송되었습니다.'
          });
        } else {
          await swalWithCenter.fire({
            icon: 'error',
            title: '오류',
            text: '견적서 전송에 실패했습니다.'
          });
        }
      } catch (err) {
        console.error("견적서 전송 오류:", err);
        swalWithCenter.fire({
          icon: 'error',
          title: '오류',
          text: '견적서 전송 중 오류 발생'
        });
      }
    },
    async completeProject(estimate) {
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
          const res = await fetch(`${API_URL}/api/estimate-request/${estimate._id}/complete`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
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
            headers: { "Content-Type": "application/json" },
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
    // 오늘의 가격 관리 탭 저장: PUT /api/price-config 호출
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
          // 스토어의 가격 설정도 업데이트
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
    // 관리자페이지 진입 시 백엔드에서 가격 설정 불러오기
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/api/estimate-request?username=${encodeURIComponent(username)}&projectName=${encodeURIComponent(projectName)}`, {
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
  max-width: 1912px;
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
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
button {
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin-right: 5px;
}
button:hover {
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
