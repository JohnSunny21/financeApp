import { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import transactionService from "../services/transactionService";
import TransactionList from "../components/TransactionList";
import FilterBar from "../components/FilterBar";
import EditTransactionModal from "../components/EditTransactionModal";
import PaginationControls from "../components/PaginationControls";

const TRANSACTIONS_PER_PAGE = 30; // Define page size.

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]); // Holds the master list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- New State for Pagination -----
  const [paginationInfo, setPaginationInfo] = useState({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0,
  });

  // State to hold the current filter values
  const [filters, setFilters] = useState({
    description: "",
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // The core data fetching function
  // useCallback prevents this function from being recreated on every render,
  // which is good practice when it's a dependency of useEffect.
  const fetchTransactions = useCallback(async (page = 0, currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...currentFilters,
        page: page,
        size: TRANSACTIONS_PER_PAGE,
      };

      // Remove empty filters so we don't send them in the URL
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      const response = await transactionService.getAllTransactions(params);
      const { content, totalPages, pageNumber, totalElements } = response.data;
      setTransactions(content);
      setPaginationInfo({ totalPages, pageNumber, totalElements });
    } catch (err) {
      setError("Failed to fetch transactions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created only once.

  // Fetch all transactions once when the component first loads
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        // Fetch both initial transactions and the category list in parallel.
        const [transactionResponse, categoriesResponse] = await Promise.all([
          transactionService.getAllTransactions({ page: 0, size: 20 }), // Initial page load
          transactionService.getUniqueCategories(),
        ]);

        // Set transaction data
        const { content, totalPages, pageNumber } = transactionResponse.data;
        setTransactions(content);
        setPaginationInfo({ totalPages, pageNumber });

        // Set category data
        setUniqueCategories(categoriesResponse.data);
      } catch (err) {
        setError("Failed to load page data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []); // It will run when the components mounts .

  // This handler will be called when the filter button is clicked
  const handleFilter = () => {
    // We always go back to the first page when applying a new filter
    fetchTransactions(0, filters);
  };

  // Hanlder for when a page number is clicked in the pagination controls
  const handlePageChange = (pageNumber) => {
    fetchTransactions(pageNumber, filters);
  };

  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setShowEditModal(true);
  };

  const handleTransactionChange = () => {
    fetchTransactions(paginationInfo.pageNumber, filters);
  };

  const handleTransactionUpdated = async (id, updatedData) => {
    try {
      await transactionService.updateTransaction(id, updatedData);
      setShowEditModal(false); // Close modal first for better UX
      handleTransactionChange(); // Then refresh all data
    } catch (err) {
      setError("Failed to update the transaction");
      console.error("Failed to update transaction", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you wan to delete this transaction?")) {
      try {
        await transactionService.deleteTransaction(id);
        handleTransactionChange(); // Refresh all data
      } catch (err) {
        console.error("Failed to delete transaction", err);
        setError("Could not delete the transaction");
      }
    }
  };

  return (
    <div className="page-container">
      <Container fluid>
        <h2 className="mb-4">Transaction Ledger</h2>
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onFilter={handleFilter}
          categories={uniqueCategories}
        />

        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          // Apply the new scrollable container class here
          <div className="scrollable-list-container">
            <TransactionList
              transactions={transactions}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </div>
        )}

        <PaginationControls
          currentPage={paginationInfo.pageNumber}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageChange}
        />

        {/* RENDER THE EDIT MODAL */}
        {currentTransaction && (
          <EditTransactionModal
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            transaction={currentTransaction}
            onTransactionUpdated={handleTransactionUpdated}
          />
        )}
      </Container>
    </div>
  );
};

export default TransactionPage;
