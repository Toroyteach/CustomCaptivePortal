import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
import api from "../utils/api";

const PrivateRoute = ({ children }) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, setUser]);

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;