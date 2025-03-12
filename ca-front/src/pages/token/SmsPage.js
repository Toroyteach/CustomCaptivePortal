import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";

const SmsPage = () => {
  const { data: smss } = useQuery({
    queryKey: ["sms"],
    queryFn: () => api.get("/posts").then((res) => res.data),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">SMS Sent Log</h1>
      <ul>
        {smss?.map((sms) => (
          <li key={sms.id}>{sms.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SmsPage;