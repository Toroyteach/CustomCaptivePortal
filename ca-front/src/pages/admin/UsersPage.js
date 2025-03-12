import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const UsersPage = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data),
  });

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error fetching users.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-3 bg-gray-100 rounded-md flex justify-between items-center">
            <span>{user.username} - {user.role}</span>
            <button
              onClick={() => navigate(`/user/${user.id}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;