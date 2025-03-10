import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const UsersPage = () => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;