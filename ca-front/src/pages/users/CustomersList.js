import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";

const CustomersList = () => {
    const { data: customers, isLoading } = useQuery({
        queryKey: ["customers"],
        queryFn: () => api.get("/users/customers/getAll").then((res) => res.data),
    });

    return (
        <>
            <NavigationBar />
            <Container className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="h4">Clients</h1>
                    <Link to="/customers/create">
                        <Button variant="primary">+ Create New Customer</Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                        <p>Loading customers...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers?.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.username}</td>
                                    <td>{customer.mobilephone}</td>
                                    <td>{customer.email}</td>
                                    <td>
                                        <Link to={`/customers/${customer.id}`}>
                                            <Button variant="info" size="sm">View</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
};

export default CustomersList;