import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueryParams } from "../context/QueryContext";

const Register = () => {
    const queryParams = useQueryParams();
    const [form, setForm] = useState({
        username: "",
        mobilephone: "",
        email: "",
        privacyChecked: false
    });
    const [redirectUrl, setRedirectUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // const API_URL = 'http://127.0.0.1:4000/api';
    const API_URL = 'http://guestwifiapi.ca.go.ke';

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
            await axios.post(`${API_URL}/auth/register`, form);
            setMessage("Registration successfull! Check your phone for login details.");

            const redirectUrl = `http://guestwifi.ca.go.ke/?switch_url=${queryParams.switch_url || 'https://192.0.2.1/login.html'}` +
                `&ap_mac=${queryParams.ap_mac || ''}` +
                `&client_mac=${queryParams.client_mac || ''}` +
                `&wlan=${queryParams.wlan || ''}` +
                `&redirect=${queryParams.redirect || ''}`;

            setRedirectUrl(redirectUrl);

            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="d-flex flex-column align-items-center justify-content-center vh-100 p-3">
            <img
                src="/logo.svg"
                alt="CA Kenya"
                className="mb-3"
                style={{
                    width: "250px",
                    height: "auto",
                    objectFit: "contain",
                    "@media (max-width: 768px)": { width: "180px" } // Scales for smaller screens
                }}
            />
            <h2 className="text-center">Register</h2>

            {message && <Alert variant="success" className="w-100 text-center">{message}</Alert>}
            {error && <Alert variant="danger" className="w-100 text-center">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "400px" }}>
                <Form.Group className="mb-2">
                    <Form.Label>Fullname</Form.Label>
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
                    <Form.Check
                        type="checkbox"
                        label="I agree to the Privacy Policy"
                        name="privacyChecked"
                        checked={form.privacyChecked}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100 mb-2" disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Register"}
                </Button>
            </Form>

            {/* {redirectUrl && (
                <Alert variant="info" className="w-100 text-center mt-3">
                    Redirect URL: <br /><code>{redirectUrl}</code>
                </Alert>
            )} */}

            <div className="mt-3 d-flex flex-column align-items-center w-100" style={{ maxWidth: "400px" }}>
                <Button variant="link" onClick={() => navigate("/privacy-policy")} className="w-100">Privacy Policy</Button>
                <Button variant="outline-secondary" onClick={() => navigate(`/recover`)} className="w-100 mt-2">Already Registered?</Button>
            </div>
        </Container>
    );
};

export default Register;