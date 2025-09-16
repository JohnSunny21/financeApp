import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { PREDEFINED_CATEGORIES } from "../constants/categories";

const EditTransactionModal = ({
  show,
  handleClose,
  transaction,
  onTransactionUpdated,
}) => {

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // This is the key part:
  // When the 'transaction' prop changes, update the form's state
  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount);
      // The date from the backend needs to be formatted for the <input type="date">
      setDate(new Date(transaction.date).toISOString().slice(0, 10));
      setCategory(transaction.category);
      setType(transaction.type);

      const isPredefined = PREDEFINED_CATEGORIES.includes(transaction.category);
      if (isPredefined) {
        setSelectedCategory(transaction.category);
        setCustomCategory("");
      } else {
        setSelectedCategory("Other");
        setCustomCategory(transaction.category);
      }
    }
  }, [transaction]); // This effect runs whenever the 'transaction' prop changes.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const finalCateory =
      selectedCategory === "Other" ? customCategory : selectedCategory;
    if (!finalCateory.trim()) {
      return;
    }
    const updateData = {
      description,
      amount: parseFloat(amount),
      date,
      category,
      type,
    };

    // The 'onTransactionUpdated' function is passed from the dashboard
    // It will handle the API call and state update.
    onTransactionUpdated(transaction.id, updateData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title> Edit Transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        {/* The form is identical to the Add modal, but values are pre-filled */}
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
          {/* ... other form groups for amount, date, category, type ... */}
          <Form.Group className="mb-3">
            <Form.Label>Amount (₹)</Form.Label>
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
              <option value="Other">Other (Please Specify)</option>
            </Form.Select>
          </Form.Group>
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
              <option value="INCOME">INCOME</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTransactionModal;
