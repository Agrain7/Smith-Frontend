<template>
  <div class="admin-panel">
    <h1>관리자 페이지 - 회원 관리</h1>
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
</template>

<script>
export default {
  name: "AdminPanel",
  data() {
    return {
      users: [],
    };
  },
  methods: {
    fetchUsers() {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // localStorage와 sessionStorage 모두 확인
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log("Fetched token:", token);
      fetch(`${apiUrl}/api/users`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 인증 헤더에 토큰 추가
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
            this.fetchUsers(); // 삭제 후 목록 갱신
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
  },
  mounted() {
    this.fetchUsers();
  },
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
table {
  width: 100%;
  border-collapse: collapse;
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
}
button:hover {
  background-color: #0056b3;
}
</style>
