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

      <!-- 프로젝트 및 견적서 전송 탭 (신규 견적 요청 제출 폼 제거, 테이블만 남김) -->
      <div v-if="currentTab === 'estimates'">
        <table>
          <thead>
            <tr>
              <th>아이디</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>이메일주소</th>
              <th>프로젝트명</th>
              <th>견적서파일 확인하기</th>
              <th>견적서 전송하기</th>
              <th>프로젝트 완료</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(estimate, index) in estimateRequests" :key="index">
              <td>{{ estimate.username }}</td>
              <td>{{ estimate.name }}</td>
              <td>{{ estimate.phone }}</td>
              <td>{{ estimate.email }}</td>
              <td>{{ estimate.projectName }}</td>
              <td>
                <button v-if="estimate.fileName" @click="viewFile(estimate)">
                  {{ estimate.fileName }}
                </button>
                <span v-else>파일 없음</span>
              </td>
              <td>
                <button @click="updateEstimateFile(estimate)">파일 업로드</button>
                <button @click="sendEstimate(estimate)">전송</button>
              </td>
              <td>
                <button @click="completeProject(estimate)">완료</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import emailjs from 'emailjs-com';

export default {
  name: "AdminPanel",
  data() {
    return {
      currentTab: 'members', // 기본 탭: 회원관리
      users: [],
      // 견적 요청 목록을 저장할 배열 (예시 데이터가 없으면 빈 배열)
      estimateRequests: []
    };
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

    // 견적 요청 목록 관련 메서드 (예시)
    viewFile(estimate) {
      alert(`파일명: ${estimate.fileName}\n내용:\n${estimate.fileContent}`);
    },
    updateEstimateFile(estimate) {
      alert(`사용자 ${estimate.username}의 견적서 파일을 업데이트합니다.`);
      // 실제 구현 시, 해당 견적 객체의 파일 업데이트 로직 추가
    },
    sendEstimate(estimate) {
      const templateParams = {
        username: estimate.username,
        name: estimate.name,
        phone: estimate.phone,
        projectName: estimate.projectName,
        email: estimate.email,
        file_content: estimate.fileContent,
        filename: estimate.fileName
      };
      emailjs.send('service_ut6rmkh', 'template_f7rf82t', templateParams, 'umd5YAQiBuxttvCy2')
        .then(
          (response) => {
            alert('견적서 전송 성공');
          },
          (error) => {
            console.error('견적서 전송 실패:', error);
            alert('견적서 전송에 실패하였습니다.');
          }
        );
    },
    completeProject(estimate) {
      alert(`사용자 ${estimate.username}의 프로젝트가 완료되었습니다.`);
      // 필요 시, 해당 견적 요청의 상태 업데이트 로직 추가
    }
  },
  mounted() {
    this.fetchUsers();
    // 실제 데이터가 있다면, 견적 요청 목록도 백엔드 API 호출을 통해 불러올 수 있습니다.
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

/* 탭 메뉴 스타일 */
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

/* 테이블 스타일 */
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

/* 견적 요청 폼 관련 스타일은 제거되었습니다. */
</style>
