import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";

const TokenRequestPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobilephone: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/users/customers", formData);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage("Customer created successfully! And Token Sent to user");
      setErrorMessage(null);
      setFormData({ username: "", email: "", mobilephone: "" });
    },
    onError: () => {
      setErrorMessage("Failed to create customer. Please try again.");
      setSuccessMessage(null);
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Page Content */}
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Card className="shadow-lg p-4" style={{ width: "500px" }}>
        <Button variant="secondary" className="w-100" onClick={() => navigate("/customers")}>
            Back to clients
          </Button>
          <h2 className="text-center mb-4">Request a Client Signup Token</h2>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="mobilephone"
                value={formData.mobilephone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={mutation.isLoading}>
              {mutation.isLoading ? <Spinner size="sm" animation="border" /> : "Create Client"}
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default TokenRequestPage;