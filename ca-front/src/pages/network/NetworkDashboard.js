import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import {
    Card, Spinner, Container, Row, Col,


    Alert
} from "react-bootstrap";
import NavigationBar from "../../components/Navbar";

const NetworkDashboard = () => {
    // Fetch Data
    const { data: users, isLoading: loadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: async () => (await api.get("/radius/users")).data,
    });

    const { data: authLogs, isLoading: loadingAuthLogs } = useQuery({
        queryKey: ["authLogs"],
        queryFn: async () => (await api.get("/radius/auth-logs")).data,
    });

    const { data: activeSessions, isLoading: loadingActiveSessions } = useQuery({
        queryKey: ["activeSessions"],
        queryFn: async () => (await api.get("/radius/active-sessions")).data,
    });

    const { data: highUsage, isLoading: loadingHighUsage } = useQuery({
        queryKey: ["highUsage"],
        queryFn: async () => (await api.get("/radius/high-usage")).data,
    });

    const { data: frequentFailures, isLoading: loadingFrequentFailures } = useQuery({
        queryKey: ["frequentFailures"],
        queryFn: async () => (await api.get("/radius/frequent-failures")).data,
    });

    if (loadingUsers || loadingAuthLogs || loadingActiveSessions || loadingHighUsage || loadingFrequentFailures) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    // Chart Data
    const chartData = {
        labels: highUsage?.map((user) => user.username),
        datasets: [
            {
                label: "High Usage (GB)",
                data: highUsage?.map((user) => user.acctoutputoctets / 1e9), // Convert bytes to GB
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    };

    return (
        <div className="container-fluid">
            {/* Sidebar */}
            <NavigationBar />

            {/* Main Dashboard */}
            <Container className="p-4">
                <h2 className="mb-4">Network Dashboard</h2>

                <Row className="g-4">
                    {/* Users */}
                    <Col md={6} lg={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Users</Card.Title>
                                {users?.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {users.slice(0, 5).map((user) => (
                                            <li key={user.id} className="list-group-item">
                                                {user.username} - {user.mobilephone}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Alert variant="warning">No users available</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Recent Auth Logs */}
                    <Col md={6} lg={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Recent Auth Logs</Card.Title>
                                {authLogs?.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {authLogs.slice(0, 5).map((log, index) => (
                                            <li key={index} className="list-group-item">
                                                {log.username} - {log.authdate}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Alert variant="warning">No authentication logs available</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Active Sessions */}
                    <Col md={6} lg={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Active Sessions</Card.Title>
                                {activeSessions?.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {activeSessions.slice(0, 5).map((session, index) => (
                                            <li key={index} className="list-group-item">
                                                {session.username} - Active
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Alert variant="warning">No active sessions</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* High Usage Chart */}
                    <Col xs={12}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>High Data Usage</Card.Title>
                                {highUsage?.length > 0 ? (
                                    <Bar data={chartData} />
                                ) : (
                                    <Alert variant="warning">No high usage data available</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Frequent Failures */}
                    <Col md={6} lg={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Frequent Failures</Card.Title>
                                {frequentFailures?.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {frequentFailures.map((fail, index) => (
                                            <li key={index} className="list-group-item">
                                                {fail.username} - {fail.attempts} failed attempts
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Alert variant="warning">No frequent failures recorded</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default NetworkDashboard;