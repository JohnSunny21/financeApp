import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import heroImage from "../assets/finance_illustrations.svg";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="hero-section text-center text-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-lg-start">
              <h1 className="hero-title">Take Control of your Finances.</h1>
              <p className="hero-subtitle">
                Stop wondering where your money goes. Track expenses, understand
                your spending habits with ML-powered insights, and build a
                better financial future.
              </p>
              <Button
                as={Link}
                to="/register"
                variant="primary"
                size="lg"
                className="me-2"
              >
                Get Started for Free{" "}
              </Button>
              <Button as={Link} to="/login" variant="outline-light" size="lg">
                Login
              </Button>
            </Col>
            <Col lg={6}>
              <img
                src={heroImage}
                alt="Financial management"
                className="img-fluid hero-image"
              />
            </Col>
          </Row>
        </Container>
      </header>
      <section className="features-section">
        <Container>
          <h2 className="text-center mb-5">Why You'll love FinTrack</h2>
          <Row>
            <Col md={4} className="feature-item">
              <h3>📊 Effortless Tracking </h3>
              <p>
                Quickly log your income and expenses. Our smart Category system
                makes it a breeze.
              </p>
            </Col>
            <Col md={4} className="feature-item">
              <h3>🧠 AI-Powered Insights</h3>
              <p>
                Discover your unique spending patterns with our clustering
                analysis.
              </p>
            </Col>
            <Col md={4} className="feature-item">
              <h3>📈 Visualize Your Growth</h3>
              <p>
                See your financial health at a glance with interactive charts
                and summaries.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
