import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="shadow-lg p-4 text-center" style={{ width: "400px" }}>
        <h3 className="text-danger">Unauthorized Access</h3>
        <p>You do not have permission to view this page.</p>
        <Button as={Link} to="/token-request" variant="primary">
          Request Access
        </Button>
      </Card>
    </Container>
  );
};

export default UnauthorizedPage;