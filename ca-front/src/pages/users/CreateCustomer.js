import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Spinner, Card } from "react-bootstrap";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";

const CreateCustomer = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        username: "",
        mobilephone: "",
        email: "",
    });

    const [error, setError] = useState("");

    const createCustomer = useMutation({
        mutationFn: async (newCustomer) => api.post("/users/customers", newCustomer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            navigate("/customers");
        },
        onError: (error) => {
            console.error("Creation failed:", error);
            setError(error.response?.data?.message || "Failed to create customer");
        },
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Simple validation
        if (!formData.username || !formData.mobilephone || !formData.email) {
            setError("All fields are required.");
            return;
        }

        createCustomer.mutate(formData);
    };

    return (
        <>
            <NavigationBar />
            <Container className="d-flex justify-content-center align-items-center mt-4">
                <Card style={{ width: "30rem" }} className="shadow p-4">
                    <Card.Body>
                        <Card.Title className="text-center">Create New Client</Card.Title>
                        {error && <p className="text-danger text-center">{error}</p>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="mobilephone"
                                    value={formData.mobilephone}
                                    onChange={handleChange}
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
                                    required
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between">
                                <Button variant="secondary" onClick={() => navigate("/customers")}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" disabled={createCustomer.isLoading}>
                                    {createCustomer.isLoading ? <Spinner size="sm" animation="border" /> : "Create Client"}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default CreateCustomer;