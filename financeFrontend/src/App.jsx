import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import AnalysisPage from "./pages/AnalysisPage";
import AppNavbar from "./components/AppNavbar";
import HomePage from "./pages/HomePage";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import TransactionPage from "./pages/TransactionPage";

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div className="app-container">
      <AppNavbar />
      {/* we will define our routes here */}
      <main className="page-container">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* This is our new protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <AnalysisPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
