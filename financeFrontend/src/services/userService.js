import api from "./api";

const changePassword = (passwordData) => {
  return api.post("user/change-password", passwordData);
};

const userService = {
  changePassword,
};

export default userService;
