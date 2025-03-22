const API_URL = "http://localhost:8080/api/auth";

const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email, 
      password: password
    }),
  });
  // Xử lý response...
};

const register = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email,
      password: password
      // Thêm trường name nếu backend hỗ trợ
    }),
  });
  // Xử lý response...
};