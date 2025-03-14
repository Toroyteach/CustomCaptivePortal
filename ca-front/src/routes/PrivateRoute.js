import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
import api from "../utils/api";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !user) {
      api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUser(response.data)})
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, setUser]);

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;