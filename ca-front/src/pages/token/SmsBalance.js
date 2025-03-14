import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Spinner, Alert } from "react-bootstrap";
import api from "../../utils/api";

const SmsBalance = () => {
  const { data: balance, isLoading, isError } = useQuery({
    queryKey: ["sms-balance"],
    queryFn: () => api.get("/notifications/sms-balance").then((res) => res.data),
  });

  return (
    <Card className="shadow-sm text-center mx-auto" style={{ maxWidth: "350px" }}>
      <Card.Body>
        <h5 className="fw-bold mb-3">Tokens Balance</h5>

        {isLoading ? (
          <Spinner animation="border" variant="primary" />
        ) : isError ? (
          <Alert variant="danger">Failed to load SMS balance.</Alert>
        ) : (
          <h4 className="text-success fw-bold">{balance.balance} Remaining</h4>
        )}
      </Card.Body>
    </Card>
  );
};

export default SmsBalance;