import api from "./api";

const getAllTransactions = (params = {}) => {
  
  return api.get("/transactions", { params });
};

const addTransaction = (transactionData) => {
  return api.post("/transactions", transactionData);
};

const updateTransaction = (id, transactionData) => {
  return api.put(`/transactions/${id}`, transactionData);
};

const deleteTransaction = (id) => {
  return api.delete(`/transactions/${id}`);
};

const getTransactionSummary = () => {
  return api.get("/transactions/summary");
};

const getCategorySummary = () => {
  return api.get("/transactions/summary/category");
};

const getUniqueCategories = () =>{
  return api.get("/transactions/categories");
}

const transactionService = {
  getAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getCategorySummary,
  getUniqueCategories,
};

export default transactionService;
