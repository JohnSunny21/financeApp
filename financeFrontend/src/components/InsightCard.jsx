import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";

const InsightCard = ({ insight }) => {
  if (!insight) {
    return null;
  }

  const {
    clusterName,
    transactionCount,
    averageAmount,
    dominantCategory,
    transactions,
  } = insight;

  // Function to format the currency.
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header as="h5" className="">
        {clusterName}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          This cluster contains <strong>{transactionCount}</strong> transactions
          with an average spending of{" "}
          <strong>{formatCurrency(averageAmount)}</strong> per transaction. The
          most common category in this group is{" "}
          <Badge bg="primary">{dominantCategory}</Badge>
        </Card.Text>
        <h6 className="mt-4">Transactions in this Cluster:</h6>
        <ListGroup variant="flush">
          {transactions &&
            transactions.map((tx, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between
                    align-items-center"
              >
                <span>
                  {tx.description} ({new Date(tx.date).toLocaleDateString()})
                </span>
                <span className="fw-bold">{formatCurrency(tx.amount)}</span>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default InsightCard;
