import { Row, Col, Form, Button } from "react-bootstrap";

const FilterBar = ({ filters, setFilters, onFilter, categories }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleReset = () => {
    setFilters({
      description: "",
      type: "",
      category: "",
      startDate: "",
      endDate: "",
    });

    // We might want onFilter to be called automatically on reset
    // onFilter(); //Optional : uncomment to auto-apply after reset.
  };

  return (
    <div
      className="p-3 mb-4 rounded"
      style={{ backgroundColor: "var(--background-secondary)" }}
    >
      <Row className="g-3 align-items-end">
        <Col sm={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label>Search Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={filters.description || ""}
              onChange={handleInputChange}
              placeholder="e.g., Coffee, Rent..."
            />
          </Form.Group>
        </Col>
        <Col sm={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={filters.category}
              onChange={handleInputChange}
            >
              <option value="">All</option>
              {/* Dynamically populate categories */}
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        {/* Filter by Type */}
        <Col sm={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={filters.type || ""}
              onChange={handleInputChange}
            >
              <option value="">All</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={12} md={6} lg={3}>
          {/* Filter by DATE RANGE */}
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col sm={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        {/* ------ ACTION BUTTONS -------*/}
        <Col sm={6} md={3} lg={1}>
          <Button variant="primary" className="w-100" onClick={onFilter}>
            Apply
          </Button>
        </Col>
        <Col sm={6} md={3} lg={1}>
          <Button
            variant="outline-secondary"
            onClick={handleReset}
            className="w-100"
          >
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FilterBar;
