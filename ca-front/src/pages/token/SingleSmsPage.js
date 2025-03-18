import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container, Card, Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";

const SingleSmsLog = () => {
    const { mobile } = useParams();

    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // Items per page

    // Fetch data using React Query
    const { data, isLoading, isError } = useQuery({
        queryKey: ["sms-log", mobile, page],
        queryFn: () => api.get(`/notifications/logs/${mobile}?page=${page}&limit=${limit}`).then((res) => res.data),
        keepPreviousData: true,
    });

    // Update logs when data is available
    useEffect(() => {
        if (data?.data) {
            setLogs(data.data);
        }
    }, [data]);
    
    return (
        <>
            {/* Navbar */}
            <NavigationBar />

            {/* Main Content */}
            <Container className="py-4">
                <Card className="shadow-sm mb-4">
                    <Card.Body>
                        <h2 className="text-center">Messages Sent to {mobile}</h2>
                    </Card.Body>
                </Card>

                {/* Loading and Error Handling */}
                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading messages...</p>
                    </div>
                ) : isError ? (
                    <Alert variant="danger">Failed to load messages for {mobile}.</Alert>
                ) : logs.length === 0 ? (
                    <Alert variant="info">No messages found for this number.</Alert>
                ) : (
                    <>
                        <Row className="g-4">
                            {logs.map((log, index) => (
                                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                                    <Card className="shadow-sm h-100">
                                        <Card.Body>
                                            <h5 className="fw-bold">Message</h5>
                                            <p>{log.msg_message_text}</p>
                                            <hr />
                                            <p><strong>Sent At:</strong> {new Date(log.dateCreated).toLocaleString()}</p>
                                            <p><strong>Token:</strong> {log.shortCode}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

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
                                disabled={data?.data.length < limit}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}

                {/* Back Button */}
                <div className="text-center mt-4">
                    <Link to="/sms-logs">
                        <Button variant="secondary">Back to SMS Logs</Button>
                    </Link>
                </div>
            </Container>
        </>
    );
};

export default SingleSmsLog;