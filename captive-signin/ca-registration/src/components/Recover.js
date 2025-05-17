import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueryParams } from "../context/QueryContext";

const Recover = () => {
    const queryParams = useQueryParams();
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
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
        setLoading(true);

        try {
            await axios.post(`${API_URL}/auth/recover`, { mobilephone: phone });
            setMessage("Registration successfull! Check your phone for login details.");

            const redirectUrl = `http://guestwifi.ca.go.ke/?switch_url=${queryParams.switch_url || 'https://192.0.2.1/login.html'}` +
                `&ap_mac=${queryParams.ap_mac || ''}` +
                `&client_mac=${queryParams.client_mac || ''}` +
                `&wlan=${queryParams.wlan || ''}` +
                `&redirect=${queryParams.redirect || ''}`;

            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "User not found. Try again.");
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
                style={{ width: "250px", height: "auto", objectFit: "contain" }}
            />
            <h2 className="text-center">Request Token</h2>

            {message && <Alert variant="success" className="w-100 text-center">{message}</Alert>}
            {error && <Alert variant="danger" className="w-100 text-center">{error}</Alert>}

            <Form onSubmit={handleRecover} className="w-100" style={{ maxWidth: "400px" }}>
                <Form.Group className="mb-3">
                    <Form.Label>Mobile Phone</Form.Label>
                    <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="I agree to the Privacy Policy" checked={privacyChecked} onChange={(e) => setPrivacyChecked(e.target.checked)} />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100 mb-2" disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Submit"}
                </Button>
            </Form>

            <div className="mt-3 d-flex flex-column align-items-center w-100" style={{ maxWidth: "400px" }}>
                <Button variant="link" onClick={() => navigate("/privacy-policy")} className="w-100">Privacy Policy</Button>
                <Button variant="outline-secondary" onClick={() => navigate("/register")} className="w-100 mt-2">Register</Button>
            </div>
        </Container>
    );
};

export default Recover;