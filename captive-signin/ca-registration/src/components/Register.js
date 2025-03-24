import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [form, setForm] = useState({
        username: "",
        mobilephone: "",
        email: "",
        privacyChecked: false
    });
    const [loading, setLoading] = useState(false);
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

        if (!form.username.trim()) {
            setError("Username is required.");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            setError("Invalid email format.");
            return;
        }

        if (!/^\d{10}$/.test(form.mobilephone)) {
            setError("Mobile phone must be exactly 10 digits.");
            return;
        }

        if (!form.privacyChecked) {
            setError("You must agree to the Privacy Policy.");
            return;
        }

        if (!form.privacyChecked) {
            setError("You must agree to the Privacy Policy.");
            return;
        }
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/register`, form);
            setMessage(response.data.message || "Registration successful! Check your phone for login details.");
            setTimeout(() => {
                window.location.href = "http://guestwifi.ca.go.ke/login";
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
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
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Mobile Phone</Form.Label>
                    <Form.Control type="tel" name="mobilephone" value={form.mobilephone} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="I agree to the Privacy Policy" name="privacyChecked" checked={form.privacyChecked} onChange={handleChange} />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Register"}
                </Button>
            </Form>
            <div className="mt-3 d-flex justify-content-between w-50">
                <Button variant="link" onClick={() => navigate("/privacy-policy")}>Privacy Policy</Button>
                <Button variant="outline-secondary" onClick={() => navigate("/recover")}>Already Registere? Recover Account</Button>
            </div>
        </Container>
    );
};

export default Register;