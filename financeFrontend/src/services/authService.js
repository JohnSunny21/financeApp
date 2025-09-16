import api from "./api";

const register = (username, email, password) => {
  return api.post("/auth/register", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return api.post("/auth/login", {
    username,
    password,
  });
};


const getMe = () => {
  return api.get("/auth/me");
};

const authService = {
  register,
  login,
  getMe,
};

export default authService;
