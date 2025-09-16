import React, { useEffect, useState } from "react";
import transactionService from "../services/transactionService";
import TransactionList from "../components/TransactionList";
import Spinner from "../components/Spinner";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import { Button } from "react-bootstrap";
import SummaryCards from "../components/SummaryCards";
import authService from "../services/authService";
import CategoryChart from "../components/CategoryChart";
import { Row, Col } from "react-bootstrap";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const DASHBOARD_PAGE_SIZE = 5;

const DashboardPage = () => {
  // ----     STATE MANAGEMENT ------
  const [transactions, setTransactions] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [filters, setFilters] = useState({});

  // The state to control the modal ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null); // To hold the transaction being edited.

  // This is our main data fetching function now

  const initialFetch = async (filters) => {
    try {
      // Fetch both transactions and summary data in parallel for better efficiency.
      const [
        userResponse,
        transactionResponse,
        summaryResponse,
        categoryResponse,
      ] = await Promise.all([
        authService.getMe(),
        transactionService.getAllTransactions({
          page: 0,
          size: DASHBOARD_PAGE_SIZE,
        }),
        transactionService.getTransactionSummary(),
        transactionService.getCategorySummary(),
      ]);

      setUser(userResponse.data);
      setTransactions(transactionResponse.data.content);
      setSummaryData(summaryResponse.data);
      setCategoryData(categoryResponse.data);
      // // Use the service to get the data.
      // const response = await transactionService.getAllTransactions();
      // setTransactions(response.data); // Set the transactions in state.
    } catch (err) {
      // Set error state if the request fails.
      setError("Failed to fetch the dashboard data. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ---- DATA FETCHING----
  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    initialFetch({});
  }, []); // The empty dependency array [] means this effect run once on mount.

  // -------- HANDLER FUNCTION --------
  // Refetches just the summary data - a small, fast operation
  const refreshSummary = async () => {
    try {
      const summaryResponse = await transactionService.getTransactionSummary();
      setSummaryData(summaryResponse.data);
    } catch (err) {
      console.error("Failed to refresh summary", err);
      setError("Failed to refresh the sumamry", err);
    }
  };

  // The modal handler function
  // This function will be called by the modal after a successful submission.

  const handleTransactionAdded = (newTransaction) => {
    // 1. Add the new item to the list locally for an instant UI update
    setTransactions([newTransaction, ...transactions]);
    // 2. Refresh the summary cards
    refreshSummary();
  };

  // Called from EditTransactionModal
  const handleTransactionUpdated = async (id, updatedData) => {
    try {
      // 1. API call to update the transaction
      const response = await transactionService.updateTransaction(
        id,
        updatedData
      );
      // 2. Locally update the single item in the list for an instant UI update
      // find and replace the transaction in the state.
      setTransactions(
        transactions.map((t) => (t.id === id ? response.data : t))
      );
      // 3. Refresh the summary cards
      refreshSummary();
      setShowEditModal(false);
      //   setCurrentTransaction(null);
    } catch (err) {
      console.error("Failed to update transaction", err);
      // You could set an errot state inside the modal here.
    }
  };

  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction); // Set the transaction to edit
    setShowEditModal(true); // open the modal
  };

  const handleDelete = async (id) => {
    // Simple confirmation
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.deleteTransaction(id);
        // Filter out the deleted transaction from the state.
        setTransactions(transactions.filter((t) => t.id !== id));
        refreshSummary();
      } catch (err) {
        console.error("Failed to delete transaction", err);
        setError("Could not delete the transaction. Please try agian.");
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 className="mb-4 text-secondary">
            Hi,{" "}
            <span
              className="text-primary"
              style={{ textTransform: "capitalize" }}
            >
              {user ? user.username : "...."}
            </span>{" "}
            Your Dashboard
          </h2>
          <p className="text-secondary">
            Welcome to your personal finance overview.
          </p>
        </div>

        {/* Add the button to open the modal */}
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add Transaction
        </Button>
      </div>
      <SummaryCards summaryData={summaryData} />

      {loading && <Spinner />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Only render the list if not loading and no error*/}
      {/* pass handlers to list*/}
      <Row className="mt-5">
        <Col lg={7} md={12} className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Recent Transactions</h3>
            <Button
              as={Link}
              to="/transactions"
              variant="outline-primary"
              size="sm"
            >
              View All & Filter
            </Button>
          </div>
          {/* Apply the new scrollable container class */}
          <div className="scrollable-list-container">
            {!loading && !error && (
              <TransactionList
                transactions={transactions}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            )}
          </div>
        </Col>

        <Col lg={5} md={12}>
          <CategoryChart chartData={categoryData} theme={theme} />
        </Col>
      </Row>

      {/* Render the modal component */}
      <AddTransactionModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onTransactionAdded={handleTransactionAdded}
      />

      {/* Render Edit Modal --- */}
      {/* Only render it if there's a transaction to edit to avoid errors */}
      {currentTransaction && (
        <EditTransactionModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          transaction={currentTransaction}
          onTransactionUpdated={handleTransactionUpdated}
        />
      )}
    </div>
  );
};

export default DashboardPage;
