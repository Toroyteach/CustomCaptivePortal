import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container, Card, Spinner, Alert, Row, Col, Form, Button } from "react-bootstrap";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";
import SmsBalance from "./SmsBalance";
import { CSVLink } from "react-csv";

const SmsLogsList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sms-logs"],
    queryFn: () => api.get("/notifications/message-log").then((res) => res.data),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const [logs, setLogs] = useState([]);

  // Update logs when data is available
  useEffect(() => {
    if (data && data.logs) {
      setLogs(data.logs);
    }
  }, [data]);

  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(() => [
    { accessorKey: "index", header: "#", cell: ({ row }) => row.index + 1 },
    {
      accessorKey: "msisdn", header: "Recipient", cell: ({ row }) => (
        <Link to={`/sms-logs/${row.original.msisdn}`} className="text-primary">
          {row.original.msisdn}
        </Link>
      ),
    },
    { accessorKey: "text", header: "Message" },
    { accessorKey: "dateCreated", header: "Date Sent", cell: ({ row }) => new Date(row.original.dateCreated).toLocaleString() },
  ], []);

  const table = useReactTable({
    data: logs, // Ensures the table is only populated when logs are available
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Prepare CSV Data
  const csvData = logs.map(({ msisdn, text, dateCreated }) => ({
    Recipient: msisdn,
    Message: text,
    "Date Sent": new Date(dateCreated).toLocaleString(),
  }));

  return (
    <>
      <NavigationBar />

      <Container className="py-4">
        <Card className="shadow-sm">
          <Card.Body>
            <Row className="align-items-center mb-4">
              <Col>
                <h2 className="m-0">Sent SMS Logs</h2>
              </Col>
              <Col xs="auto">
                <SmsBalance />
              </Col>
            </Row>

            {/* Export CSV Button */}
            {logs.length > 0 && (
              <div className="mb-3">
                <CSVLink data={csvData} filename="sms_logs.csv" className="btn btn-success">
                  Export CSV
                </CSVLink>
              </div>
            )}

            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading SMS logs...</p>
              </div>
            ) : isError ? (
              <Alert variant="danger">Failed to load SMS logs.</Alert>
            ) : logs?.length === 0 ? (
              <Alert variant="info">No SMS logs available.</Alert>
            ) : (
              <>
                <Form.Select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="mb-2"
                  style={{ width: "150px" }}
                >
                  <option value={10}>Show 10</option>
                  <option value={20}>Show 20</option>
                </Form.Select>

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

export default SmsLogsList;