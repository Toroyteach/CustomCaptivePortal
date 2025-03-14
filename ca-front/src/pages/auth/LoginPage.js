import React, { useState } from "react";
import { Form, Button, Card, Container, Image, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = await login(formData);
            if (role === "admin") {
                navigate("/");
            } else if (role === "manager") {
                navigate("/token-request");
            } else {
                navigate("/"); // Default redirect
            }
        } catch (error) {
            setShowToast(true); // Show toast on login failure
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "500px" }} className="shadow p-4">
                {/* Logo Section */}
                <div className="text-center mb-3">
                    <Image
                        src="/logo.svg"
                        alt="CA Kenya"
                        width={400}
                        height={200}
                        className="mb-2"
                        roundedCircle
                    />
                </div>

                <h3 className="text-center mb-4">Login</h3>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Login
                    </Button>
                </Form>

                {/* Error Toast Notification */}
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    className="position-absolute top-0 end-0 m-6 bg-danger text-white"
                >
                    <Toast.Body>{error}</Toast.Body>
                </Toast>
            </Card>
        </Container>
    );
};

export default LoginPage;