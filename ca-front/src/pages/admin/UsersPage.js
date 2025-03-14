import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Container } from "react-bootstrap";
import { CSVLink } from "react-csv";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";

const UsersPage = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data),
  });

  if (isLoading)
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" />
      </div>
    );

  if (error) return <p className="text-danger">Error fetching users.</p>;

  return (
    <div className="container-fluid">
      {/* Sidebar */}
      <NavigationBar />

      <Container className="py-4">
        <div className="d-flex justify-content-between mb-3">
          <h2>Users</h2>
          <CSVLink data={users} filename="users.csv" className="btn btn-success">
            Export CSV
          </CSVLink>
        </div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => navigate(`/user/${user.id}`)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default UsersPage;