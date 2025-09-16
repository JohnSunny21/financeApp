import { Row, Col, Card } from "react-bootstrap";

const SummaryCards = ({ summaryData }) => {
  

  
  const {
    totalIncome = 0,
    totalExpenses = 0,
    netBalance = 0,
  } = summaryData || {};
  
  return (
    <Row className="mb-4">
      <Col md={4} className="mb-3 mb-md-0">
        <Card bg="success" text="white" className="shadow-sm">
          <Card.Body>
            <Card.Title> Total Income (Current Month)</Card.Title>
            <Card.Text className="h3">₹{totalIncome.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className="mb-3 mb-md-0">
        <Card bg="danger" text="white" className="shadow-sm">
          <Card.Body>
            <Card.Title>Total Expenses </Card.Title>
            <Card.Text className="h3">₹{totalExpenses.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card bg="info" text="white" className="shadow-sm">
          <Card.Body>
            <Card.Title>Net Balance</Card.Title>
            <Card.Text className="h3">₹{netBalance.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;
