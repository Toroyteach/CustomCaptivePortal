import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import {
    Card, Spinner, Container, Row, Col, Alert, Form, Button,
} from "react-bootstrap";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
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

    const [pageSize, setPageSize] = useState(10); // Default page size

    const columns = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "attempts", header: "Failed Attempts" },
    ];

    const table = useReactTable({
        data: frequentFailures?.frequentFailures || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
                    <Col md={6} lg={6}>
                    <>
    {/* Page Size Selector */}
    <Form.Select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="mb-2"
        style={{ width: "150px" }}
    >
        <option value={10}>Show 10</option>
        <option value={20}>Show 20</option>
    </Form.Select>

    {/* Scrollable Table */}
    <div className="table-responsive overflow-auto" style={{ maxHeight: "400px" }}>
        <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    {/* Pagination Controls */}
    <div className="d-flex justify-content-between align-items-center mt-3">
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} variant="secondary" size="sm">
            Previous
        </Button>
        <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="secondary" size="sm">
            Next
        </Button>
    </div>
</>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default NetworkDashboard;