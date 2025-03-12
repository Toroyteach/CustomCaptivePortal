import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            navigate("/");
        } catch (error) {
            // No need to manually alert, UI should display the error
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;