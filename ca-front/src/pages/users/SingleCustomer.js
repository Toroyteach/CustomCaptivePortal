import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";

const SingleCustomerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: customer, isLoading } = useQuery({
        queryKey: ["customer", id],
        queryFn: () => api.get(`/users/customers/${id}`).then((res) => res.data),
    });

    const deleteCustomer = useMutation({
        mutationFn: async () => {
            await api.delete(`/users/customers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            navigate("/customers");
        },
        onError: (error) => {
            console.error("Delete failed:", error);
            alert("Failed to delete customer");
        },
    });

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            deleteCustomer.mutate();
        }
    };

    if (isLoading) {
        return (
            <Container className="text-center mt-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading customer details...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <>
            <NavigationBar />
            <Container className="py-4 d-flex justify-content-center">
                <Card style={{ width: "30rem" }} className="shadow">
                    <Card.Body>
                        <Card.Title className="text-center mb-3">Customer Details</Card.Title>
                        <Card.Text><strong>Name:</strong> {customer.username || "N/A"}</Card.Text>
                        <Card.Text><strong>Phone:</strong> {customer.mobilephone || "N/A"}</Card.Text>
                        <Card.Text><strong>Email:</strong> {customer.email}</Card.Text>
                        <Card.Text><strong>Host Email:</strong> {customer.hostEmail}</Card.Text>
                        <Card.Text><strong>Created At:</strong> {new Date(customer.created_at).toLocaleString()}</Card.Text>
                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={() => navigate("/customers")}>Back</Button>
                            <Button variant="danger" onClick={handleDelete}>Delete Customer</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default SingleCustomerPage;