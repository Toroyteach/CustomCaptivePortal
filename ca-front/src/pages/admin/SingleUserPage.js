import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthProvider";

const SingleUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get(`/users/${id}`).then((res) => res.data),
  });

  const deleteUser = useMutation({
    mutationFn: async () => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users"); // Redirect after deletion
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Failed to delete user");
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">User Details</h1>
      <p><strong>Name:</strong> {user.username}</p>
      <p><strong>Role:</strong> {user.role}</p>

      {currentUser?.id !== user.id && (
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => deleteUser.mutate()}
        >
          Delete User
        </button>
      )}
    </div>
  );
};

export default SingleUserPage;