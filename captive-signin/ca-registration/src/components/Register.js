import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [form, setForm] = useState({
        username: "",
        mobilephone: "",
        email: "",
        privacyChecked: false
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // const API_URL = 'http://127.0.0.1:4000/api';
    const API_URL = 'http://guestwifiapi.ca.go.ke/api';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.privacyChecked) {
            setError("You must agree to the Privacy Policy.");
            return;
        }
        setError("");
        setMessage("");

        try {
            const response = await axios.post(`${API_URL}/auth/register`, form);
            setMessage(response.data.message || "Registration successful! Check your phone for login details.");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
            <img src="/logo.svg" alt="CA Kenya" width={500} className="mb-3" />
            <h2>Register</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="w-50">
                <Form.Group className="mb-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={form.username} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Mobile Phone</Form.Label>
                    <Form.Control type="text" name="mobilephone" value={form.mobilephone} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="I agree to the Privacy Policy" name="privacyChecked" checked={form.privacyChecked} onChange={handleChange} />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">Register</Button>
            </Form>
            <div className="mt-3 d-flex justify-content-between w-50">
                <Button variant="link" onClick={() => navigate("/privacy-policy")}>Privacy Policy</Button>
                <Button variant="outline-secondary" onClick={() => navigate("/recover")}>Already Registere? Recover Account</Button>
            </div>
        </Container>
    );
};

export default Register;