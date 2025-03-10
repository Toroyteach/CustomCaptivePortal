import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const SingleUserPage = () => {
  const { id } = useParams();
  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get(`/users/${id}`).then((res) => res.data),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">User Details</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SingleUserPage;