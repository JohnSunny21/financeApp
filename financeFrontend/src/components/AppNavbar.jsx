import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./AppNavbar.css";
import { Navbar, Container, Nav, Form, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import Logo from "./Logo";
import ChangePasswordModal from "./ChangePasswordModal";


const AppNavbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <>
      <Navbar
        bg={theme}
        variant={theme}
        expand="lg"
        sticky="top"
        className="shadow-sm"
      >
        <Container>
          {/* The brand or the App Name */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Logo
              style={{ height: "20px", width: "20px", marginRight: "10px" }}
            />
            <span>FinTrack</span>
          </Navbar.Brand>
          {/* The hamburger button */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {/* The Collapsible content */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {/* ms-auto pushes links to the right */}
              {isAuthenticated ? (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/dashboard"
                    className="nav-link-custom"
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/transactions"
                    className="nav-link-custom"
                  >
                    Transactions
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/analysis"
                    className="nav-link-custom"
                  >
                    Analysis
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="ms-3"
                    onClick={() => setShowPasswordModal(true)}
                    style={{"color":"var(--text-primary"}}
                  >
                    Change Password
                  </Button>
                  <button
                    onClick={handleLogout}
                    className="nav-button-logout ms-lg-3"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/login"
                    className="nav-link-custom"
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/register"
                    className="nav-link-custom"
                  >
                    Register
                  </Nav.Link>
                </>
              )}
              {/* Theme toggle switch */}
              <Form.Check
                type="switch"
                id="custom-switch"
                label={theme === "light" ? "🌙" : "☀️"}
                checked={theme === "dark"}
                onChange={toggleTheme}
                className="ms-3 theme-switch"
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ChangePasswordModal
        show={showPasswordModal}
        handleClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};

export default AppNavbar;

