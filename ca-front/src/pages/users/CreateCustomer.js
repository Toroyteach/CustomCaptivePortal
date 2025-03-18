import React from "react";
import { Container, Card } from "react-bootstrap";
import NavigationBar from "../../components/Navbar";

const CreateCustomer = () => {

    return (
        <>
            <NavigationBar />
            <Container className="d-flex justify-content-center align-items-center mt-4">
                <Card style={{ width: "30rem" }} className="shadow p-4">
                    <Card.Body>
                        <Card.Title className="text-center">Create New Client</Card.Title>

                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default CreateCustomer;