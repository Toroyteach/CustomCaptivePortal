import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";

const UserCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "manager",
  });

  const [error, setError] = useState("");

  const createUser = useMutation({
    mutationFn: async (newUser) => api.post("/users", newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to create user");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUser.mutate({
      username: formData.username,
      password: formData.password,
      role: formData.role,
    });
  };

  return (
    <>
      {/* Navbar */}
      <NavigationBar/>

      {/* Main Content */}
      <Container className="py-4 d-flex justify-content-center">
        <Card className="shadow-sm p-4" style={{ maxWidth: "500px", width: "100%" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Create User</h2>
            {error && <Alert variant="danger">{error}</Alert>}

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
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleChange}>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3" disabled={createUser.isLoading}>
                {createUser.isLoading ? <Spinner as="span" animation="border" size="sm" /> : "Create User"}
              </Button>

              <Button variant="secondary" className="w-100" onClick={() => navigate("/users")}>
                Back to Users
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default UserCreatePage;