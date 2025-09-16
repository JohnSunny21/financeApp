import api from "./api";

const getAnalysis = (params = {}) => {
 
  return api.get("/ml/analysis", { params });
};

const mlService = {
  getAnalysis,
};

export default mlService;
