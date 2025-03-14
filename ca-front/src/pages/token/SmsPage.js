import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container, Card, Table, Spinner, Alert, Row, Col } from "react-bootstrap";
import api from "../../utils/api";
import NavigationBar from "../../components/Navbar";
import SmsBalance from "./SmsBalance";

const SmsLogsList = () => {
  const { data: logs, isLoading, isError } = useQuery({
    queryKey: ["sms-logs"],
    queryFn: () => api.get("/notifications/message-log").then((res) => res.data),
  });

  return (
    <>
      {/* Navbar */}
      <NavigationBar />

      {/* Main Content */}
      <Container className="py-4">
        <Card className="shadow-sm">
          <Card.Body>
            {/* Header Row with SMS Balance on the Right */}
            <Row className="align-items-center mb-4">
              <Col>
                <h2 className="m-0">Sent SMS Logs</h2>
              </Col>
              <Col xs="auto">
                <SmsBalance />
              </Col>
            </Row>

            {/* Loading and Error Handling */}
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
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Recipient</th>
                    <th>Message</th>
                    <th>Date Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Link to={`/sms-logs/${log.msg_msisdn}`} className="text-primary">
                          {log.msg_msisdn}
                        </Link>
                      </td>
                      <td>{log.msg_message_text}</td>
                      <td>{new Date(log.msg_date_created).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default SmsLogsList;