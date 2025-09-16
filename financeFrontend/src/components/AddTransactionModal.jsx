import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import transactionService from "../services/transactionService";
import { PREDEFINED_CATEGORIES } from "../constants/categories";



const AddTransactionModal = ({ show, handleClose, onTransactionAdded }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today.

  const [category, setCategory] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(
    PREDEFINED_CATEGORIES[0]
  );
  const [customCategory, setCustomCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Determine the final category
    // if 'Other' is selected and a custom category is typed. use it. otherwise, use the selected one.
    const finalCategory =
      selectedCategory === "Other" ? customCategory : selectedCategory;
    // After success, we'll call onTransactionAdded() and onRequestClose()

    if (!description || !amount || !date) {
      setError("Description, Amount, and Date are required.");
      return;
    }

    const transactionData = {
      description,
      amount: parseFloat(amount),
      date,
      category: finalCategory, // Use the Determined final category
      type,
    };

    try {
      const response = await transactionService.addTransaction(transactionData);
      onTransactionAdded(response.data);
      handleClose(); 
      
      setSelectedCategory(PREDEFINED_CATEGORIES[0]);
      setCustomCategory("");
      setDescription("");
      setAmount("");
    } catch (err) {
      setError("Failed to add transaction. Please try again.");
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title> Add New Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount : </Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {PREDEFINED_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="Other">Other (Please specify)</option>
            </Form.Select>
          </Form.Group>
          {/* ---- CONDITIONAL TEXT INPUT FOR "OTHER" ---- */}
          {selectedCategory === "Other" && (
            <Form.Group className="mb-3">
              <Form.Label>Custom Category</Form.Label>
              <Form.Control
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type here..."
                required
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Transaction
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTransactionModal;
