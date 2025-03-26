import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Container, Card, Alert } from "react-bootstrap";
import { CSVLink } from "react-csv";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";

const UsersPage = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Number of users per page

  // Fetch paginated users
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page],
    queryFn: () => api.get(`/users?page=${page}&limit=${limit}`).then((res) => res.data),
    keepPreviousData: true,
  });

  // Ensure users update when data is available
  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);


  return (
    <div className="container-fluid">
      {/* Sidebar */}
      <NavigationBar />

      <Container className="py-4">
        <Card className="shadow-sm">
          <Card.Body>
            {/* Header Row */}
            <div className="d-flex justify-content-between mb-3">
              <h2>Users</h2>
              {users.length > 0 && (
                <CSVLink data={users} filename="users.csv" className="btn btn-success">
                  Export CSV
                </CSVLink>
              )}
            </div>

            {/* Loading, Error, and Empty State Handling */}
            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading users...</p>
              </div>
            ) : isError ? (
              <Alert variant="danger">Failed to load users.</Alert>
            ) : users.length === 0 ? (
              <Alert variant="info">No users found.</Alert>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
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
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => navigate(`/user/${user.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button 
                    variant="secondary" 
                    disabled={page === 1} 
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  <span>Page {page}</span>
                  <Button 
                    variant="secondary" 
                    disabled={data?.length < limit} 
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UsersPage;