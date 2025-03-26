import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Recover = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    // const API_URL = 'http://127.0.0.1:4000/api';
        const API_URL = 'http://guestwifiapi.ca.go.ke';

    const handleRecover = async (e) => {
        e.preventDefault();
        if (!privacyChecked) {
            setError("You must agree to the Privacy Policy.");
            return;
        }
        setError("");
        setMessage("");

        try {
            const response = await axios.post(`${API_URL}/auth/recover`, { mobilephone: phone });
            setMessage(response.data.message || "Recovery successful! Check SMS for details.");
        } catch (err) {
            setError(err.response?.data?.message || "User not found. Try again.");
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
            <img src="/logo.svg" alt="CA Kenya" width={500} className="mb-3" />
            <h2>Recover Account</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleRecover} className="w-50">
                <Form.Group className="mb-3">
                    <Form.Label>Mobile Phone</Form.Label>
                    <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="I agree to the Privacy Policy" checked={privacyChecked} onChange={(e) => setPrivacyChecked(e.target.checked)} />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">Recover</Button>
            </Form>
            <div className="mt-3 d-flex justify-content-between w-50">
                <Button variant="link" onClick={() => navigate("/privacy-policy")}>Privacy Policy</Button>
                <Button variant="outline-secondary" onClick={() => navigate("/register")}>Register</Button>
            </div>
        </Container>
    );
};

export default Recover;