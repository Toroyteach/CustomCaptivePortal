import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import { Button, Container, Spinner, Alert, Card, Form } from "react-bootstrap";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";
import { CSVLink } from "react-csv";

const CustomersList = () => {
    const { data: customers, isLoading, isError } = useQuery({
        queryKey: ["customers"],
        queryFn: () => api.get("/users/customers/getAll").then((res) => res.data),
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    const [pageSize, setPageSize] = useState(10); // Default page size

    const columns = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "username", header: "Name" },
        { accessorKey: "mobilephone", header: "Phone" },
        { accessorKey: "email", header: "Email" },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => (
                <Link to={`/customers/${row.original.id}`}>
                    <Button variant="info" size="sm">View More</Button>
                </Link>
            ),
        },
    ];

    const table = useReactTable({
        data: customers?.customers || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Prepare CSV Data
    const csvData = customers?.customers?.map(({ id, username, mobilephone, email }) => ({
        ID: id,
        Name: username,
        Phone: mobilephone,
        Email: email,
    })) || [];

    return (
        <>
            <NavigationBar />
            <Container className="mt-4">
                <Card className="shadow-sm">
                    <Card.Body>
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1 className="h4">Clients</h1>
                            {!isLoading && !isError && (
                                <Link to="/token-request">
                                    <Button variant="primary">+ Create New Client</Button>
                                </Link>
                            )}
                            {customers?.customers?.length > 0 && (
                                <CSVLink data={csvData} filename="customers.csv" className="btn btn-success">
                                    Export CSV
                                </CSVLink>
                            )}
                        </div>

                        {/* Loading, Error, and Empty State Handling */}
                        {isLoading ? (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                                <p>Loading clients...</p>
                            </div>
                        ) : isError ? (
                            <Alert variant="danger">Failed to load clients.</Alert>
                        ) : customers?.customers?.length === 0 ? (
                            <Alert variant="info">No Clients found.</Alert>
                        ) : (
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
                                    <Button
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        Previous
                                    </Button>
                                    <span>
                                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                    </span>
                                    <Button
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default CustomersList;