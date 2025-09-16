import React from "react";
import "../styles/TransactionList.css";
import { ListGroup, Button, Stack } from "react-bootstrap";

// We receive onEdit and onDelete functions as props from the  DASHBOARD.

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  // A small helper to format the data nicely

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (transactions.length == 0) {
    return <p> No transactions found. Add one to get Started!</p>;
  }

  return (
    <div className="transaction-list-container">
      <h3>Recent Transactions</h3>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className={transaction.type === "INCOME" ? "income" : "expense"}
            >
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>₹{transaction.amount.toFixed(2)}</td>
              <td>
                <Stack
                  direction="horizontal"
                  gap={2}
                  className="justify-content-center"
                >
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onEdit(transaction)} // Pass the whole transaction object to the handler.
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(transaction.id)} // Pass just the ID to the delete handler.
                  >
                    Delete
                  </Button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
