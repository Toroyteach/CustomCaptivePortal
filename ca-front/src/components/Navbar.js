import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider"; // Adjust based on your auth context path

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Logout Function
  const handleLogout = () => {
    logout(); // Call logout from AuthProvider
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        {/* Brand Name */}
        <Navbar.Brand as={Link} to="/">CA</Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Navigation Items */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {/* Show Admin Menu Only for Admins */}
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            )}

            {/* Show Admin Menu Only for Admins */}
            {user?.role === "admin" && (
              <NavDropdown title="Admin" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/users">All Users</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/users/create">Create User</NavDropdown.Item>
              </NavDropdown>
            )}

            {/* Show Clients Menu for Admins & Managers */}
            {(user?.role === "admin") && (
              <NavDropdown title="Client" id="clients-dropdown">
                <NavDropdown.Item as={Link} to="/customers">All Clients</NavDropdown.Item>
              </NavDropdown>
            )}

            {/* Show Tokens Sent Only for Admins */}
            {user?.role === "admin" && (
              <NavDropdown title="Tokens Sent" id="tokens-dropdown">
                <NavDropdown.Item as={Link} to="/sms-logs">All Token Logs</NavDropdown.Item>
              </NavDropdown>
            )}

            {/* Show Token Request for Admins & Managers */}
            {(user?.role === "admin" || user?.role === "manager") && (
              <Nav.Link as={Link} to="/token-request">Token Request</Nav.Link>
            )}
          </Nav>

          {/* Right Section - User Info & Authentication */}
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">Welcome, {user.username}</Navbar.Text>
                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button as={Link} to="/login" variant="primary">Login</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;