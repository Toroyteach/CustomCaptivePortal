import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Button, Spinner, Container, Row, Col, Alert } from "react-bootstrap";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthProvider";
import NavigationBar from "../../components/Navbar";

const SingleUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get(`/users/${id}`).then((res) => res.data),
  });

  const deleteUser = useMutation({
    mutationFn: async () => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users"); // Redirect after deletion
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Failed to delete user");
    },
  });

  if (isLoading)
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" />
      </div>
    );

  if (error)
    return (
      <Container className="py-4">
        <Alert variant="danger">Error fetching user details.</Alert>
      </Container>
    );

  return (
    <div className="container-fluid">
      {/* Sidebar */}
      <NavigationBar />

      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-3">User Details</Card.Title>
                <p><strong>Name:</strong> {user.username}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={() => navigate("/users")}>
                    Back to Users
                  </Button>
                  {currentUser?.id !== user.id && (
                    <Button variant="danger" onClick={() => deleteUser.mutate()}>
                      Delete User
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SingleUserPage;