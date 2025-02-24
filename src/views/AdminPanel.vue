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
      <!-- 회원관리 탭 (기존 코드 유지) -->
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

      <!-- 프로젝트 및 견적서 전송 탭 -->
      <div v-if="currentTab === 'estimates'">
        <table>
          <thead>
            <tr>
              <th>아이디</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>이메일주소</th>
              <th>프로젝트명</th>
              <th>견적요청 파일</th>
              <th>견적서 전송하기</th>
              <th>프로젝트 완료</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(estimate, index) in pendingEstimates" :key="estimate._id">
              <td>{{ estimate.username }}</td>
              <td>{{ estimate.name }}</td>
              <td>{{ estimate.phone }}</td>
              <td>{{ estimate.email }}</td>
              <td>{{ estimate.projectName }}</td>
              <td>
                <a :href="estimate.fileUrl" target="_blank">
                  {{ estimate.fileName }}
                </a>
              </td>
              <td>
                <!-- 견적서 전송 기능을 제거하고 단순 알림 -->
                <button @click="notifyEstimateSend(estimate)">전송</button>
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
              <th>아이디</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>이메일주소</th>
              <th>프로젝트명</th>
              <th>견적요청 파일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(estimate, index) in completedEstimates" :key="estimate._id">
              <td>{{ estimate.username }}</td>
              <td>{{ estimate.name }}</td>
              <td>{{ estimate.phone }}</td>
              <td>{{ estimate.email }}</td>
              <td>{{ estimate.projectName }}</td>
              <td>
                <a :href="estimate.fileUrl" target="_blank">
                  {{ estimate.fileName }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminPanel",
  data() {
    return {
      currentTab: 'members', // 기본 탭: 회원관리
      users: [],
      estimates: []  // 모든 견적 요청 데이터
    };
  },
  computed: {
    // 아직 완료되지 않은 견적 요청
    pendingEstimates() {
      return this.estimates.filter(estimate => !estimate.completed);
    },
    // 완료된 견적 요청
    completedEstimates() {
      return this.estimates.filter(estimate => estimate.completed);
    }
  },
  methods: {
    // 회원 관리 관련 메서드
    fetchUsers() {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      fetch(`${apiUrl}/api/users`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.users) {
            this.users = data.users;
          } else {
            console.error("회원 정보 불러오기 오류:", data);
            alert("회원 정보를 불러오는데 실패했습니다.");
          }
        })
        .catch(err => {
          console.error("회원 정보 불러오기 오류:", err);
          alert("회원 정보를 불러오는데 실패했습니다.");
        });
    },
    deleteUser(userId) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (confirm("정말 삭제하시겠습니까?")) {
        fetch(`${apiUrl}/api/users/${userId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
          .then(res => res.json())
          .then(data => {
            alert(data.message || "삭제되었습니다.");
            this.fetchUsers();
          })
          .catch(err => {
            console.error("회원 삭제 오류:", err);
            alert("회원 삭제에 실패했습니다.");
          });
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },

    // 견적 요청 관련 메서드
    fetchEstimates() {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      fetch(`${apiUrl}/api/estimate-request`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            this.estimates = data.estimates;
          } else {
            console.error("견적 요청 데이터 불러오기 오류:", data);
            alert("견적 요청 데이터를 불러오는데 실패했습니다.");
          }
        })
        .catch(err => {
          console.error("견적 요청 데이터 불러오기 오류:", err);
          alert("견적 요청 데이터를 불러오는데 실패했습니다.");
        });
    },
    notifyEstimateSend(estimate) {
      // 이메일 전송 기능 대신 알림창을 띄워줍니다.
      alert(`사용자 ${estimate.username}의 견적서 전송 요청이 접수되었습니다.`);
      // 실제로 데이터베이스 상태 업데이트 등의 추가 로직이 필요하면 여기에 추가합니다.
    },
    completeProject(estimate) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/api/estimate-request/${estimate._id}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("프로젝트가 완료 처리되었습니다.");
            this.fetchEstimates();
          } else {
            alert(data.message || "프로젝트 완료 처리에 실패했습니다.");
          }
        })
        .catch(err => {
          console.error("프로젝트 완료 처리 오류:", err);
          alert("프로젝트 완료 처리 중 오류 발생");
        });
    },
    updateEstimateFile(estimate) {
      alert(`사용자 ${estimate.username}의 견적서 파일을 업데이트합니다.`);
      // 실제 파일 업데이트 로직 추가 필요
    },
    viewFile(estimate) {
      window.open(estimate.fileUrl, '_blank');
    }
  },
  mounted() {
    this.fetchUsers();
    this.fetchEstimates();
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
  transition: background-color 0.3s;
}
.tabs button.active {
  background-color: #007bff;
  color: #fff;
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
</style>
