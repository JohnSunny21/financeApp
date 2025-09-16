import { ListGroup, Button, Stack } from "react-bootstrap";

// we receive onEdit and onDelete functions as props from the Dashboard.

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (!transactions) {
    return <p> No transactions found. Add one to get Started! </p>;
  }

  return (
    <ListGroup variant="flush">
      {" "}
      {/* variant = 'flush' removes outside borders */}
      {transactions.map((t) => (
        <ListGroup.Item
          key={t.id}
          className="d-flex flex-column flex-sm-row justify-content-between align-items-center"
          // The card and list styles in index.css will handle the background and border
        >
          <div className="mb-2 mb-sm-0">
            <strong
              className={t.type === "INCOME" ? "text-success" : "text-danger"}
            >
              {t.description}
            </strong>
            <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
              {new Date(t.date).toLocaleDateString()} | {t.category}
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <span
              className={`me-3 fw-bold ${
                t.type === "INCOME" ? "text-success" : "text-danger"
              }`}
            >
              {t.type === "INCOME" ? "+" : "-"}₹{t.amount.toFixed(2)}
            </span>
            <Stack direction="horizontal" gap={2}>
              {/* The onEdit function will receive the full transaction object */}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEdit(t)}
              >
                Edit
              </Button>
              {/* The onDelete function will receive just the ID */}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(t.id)}
              >
                Delete
              </Button>
            </Stack>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TransactionList;
