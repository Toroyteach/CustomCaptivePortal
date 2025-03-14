import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container, Card, Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";

const SingleSmsLog = () => {
    const { mobile } = useParams();

    const { data: logs, isLoading, isError } = useQuery({
        queryKey: ["sms-log", mobile],
        queryFn: () => api.get(`/notifications/logs/${mobile}`).then((res) => res.data),
    });

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
                ) : logs?.length === 0 ? (
                    <Alert variant="info">No messages found for this number.</Alert>
                ) : (
                    <Row className="g-4">
                        {logs.map((log, index) => (
                            <Col key={index} xs={12} sm={6} md={4} lg={3}>
                                <Card className="shadow-sm h-100">
                                    <Card.Body>
                                        <h5 className="fw-bold">Message</h5>
                                        <p>{log.msg_message_text}</p>
                                        <hr />
                                        <p><strong>Sent At:</strong> {new Date(log.msg_date_created).toLocaleString()}</p>
                                        <p><strong>Token:</strong> {log.msg_short_code}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
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