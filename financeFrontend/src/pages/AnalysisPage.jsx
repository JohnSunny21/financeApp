import React, { useState, useEffect } from "react";
import {
  Container,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import mlService from "../services/mlService";
import InsightCard from "../components/InsightCard";

const AnalysisPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const fetchAnalysis = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mlService.getAnalysis(params);
      if (response.data && response.data.insights) {
        setInsights(response.data.insights || []);
        setMessage(response.data.message || "No insights available.");
      }
    } catch (err) {
      console.error("Failed to fetch analysis: ", err);
      setError(
        "Could not retrive your spending analysis. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount (with no params for default behaviour)
  useEffect(() => {
    fetchAnalysis();
  }, []); // Empty dependency array means this runs once on mount

  // Handler for the "Analyze" button
  const handleAnalysisRequest = () => {
    // Basic validation
    if (dateRange.startDate && dateRange.endDate) {
      fetchAnalysis(dateRange);
    } else {
      // Or show an alert telling the user to select both dates
      alert("Please select both a start and end date.");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <Spinner animation="border" /> <p>Analyzing your spending...</p>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (insights.length === 0) {
      return (
        <Alert variant="info">
          {message ||
            "No spending clusters  found. Add more transactions to get an analysis."}
        </Alert>
      );
    }

    return insights.map((insight, index) => (
      <InsightCard key={index} insight={insight} />
    ));
  };

  return (
    <div className="page-container">
      <Container className="mt-4">
        <h2 className="mb-4 text-secondary">Spending Analysis</h2>
        {/* New Date filter section */}
        <div
          className="p-3 mb-4 rounded"
          style={{ backgroundColor: "var(--background-secondary)" }}
        >
          <p className="fw-bold">Analyze a Specific Period</p>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button
                variant="primary"
                onClick={handleAnalysisRequest}
                className="w-100"
              >
                Analyze Period
              </Button>
            </Col>
          </Row>
        </div>
        <p className="text-secondary mb-4">
          Here are your spending habits grouped into clusters by our machine
          learning model. This helps you identify where your money is going.
        </p>
        <h4 className="mb-3">{message}</h4>
        {renderContent()}
      </Container>
    </div>
  );
};

export default AnalysisPage;
