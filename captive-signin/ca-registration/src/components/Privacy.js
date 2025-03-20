import { Container, Button, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <Container className="d-flex justify-content-center align-items-center">
            <Card className="shadow-lg p-4" style={{ width: "210mm", maxWidth: "100%", minHeight: "297mm" }}>
                <div className="text-center mb-4">
                    {/* Logo Image */}
                    <Image
                        src="/logo.svg"
                        alt="CA Kenya"
                        width={500}
                        height={300}
                    />

                    <h2 className="mb-3">Privacy Policy</h2>
                </div>

                <div className="policy-content" style={{ textAlign: "left" }}>
                    <h4>1. Introduction</h4>
                    <p>At the <strong>Communications Authority of Kenya</strong>, we respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, store, and protect your information.</p>

                    <h4>2. Data We Collect</h4>
                    <ul>
                        <li><strong>Name:</strong> Used for identification purposes.</li>
                        <li><strong>Email Address:</strong> Used for authentication and communication.</li>
                        <li><strong>Phone Number:</strong> Used for internet access allocation and support.</li>
                    </ul>

                    <h4>3. How We Use Your Data</h4>
                    <ul>
                        <li>Managing and allocating internet resources.</li>
                        <li>Verifying your identity to provide secure network access.</li>
                    </ul>

                    <h4>4. Data Retention</h4>
                    <p>We retain your personal data securely for a maximum period of <strong>three (3) months</strong>. After this period, we may continue storing data for security and auditing purposes unless you request deletion.</p>

                    <h4>5. Your Rights</h4>
                    <ul>
                        <li><strong>Access:</strong> Request a copy of your stored personal data.</li>
                        <li><strong>Correction:</strong> Request corrections if your data is inaccurate.</li>
                        <li><strong>Deletion:</strong> Request the deletion of your personal data at any time.</li>
                    </ul>

                    <h4>6. Data Protection</h4>
                    <p>We implement strict security measures to protect your data from unauthorized access, disclosure, or misuse.</p>

                    <h4>7. How to Request Data Deletion</h4>
                    <p>If you wish to delete your personal data, please contact us:</p>
                    <p>
                        <strong>Head Office:</strong><br />
                        CA Centre<br />
                        P.O Box: 14448-00800, Nairobi<br />
                        <strong>Mobile:</strong> 0703 042000, 0730 172000<br />
                        <strong>Email:</strong> <a href="mailto:info@ca.go.ke">info@ca.go.ke</a><br />
                        <strong>Online Contact:</strong> <a href="https://www.ca.go.ke/contact-us" target="_blank" rel="noopener noreferrer">Contact Us</a>
                    </p>

                    <h4>8. Changes to This Policy</h4>
                    <p>We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated effective date.</p>

                    <h4>9. Contact Information</h4>
                    <p>If you have any questions or concerns about this policy, please reach out to us via <a href="mailto:info@ca.go.ke">info@ca.go.ke</a> or visit our <a href="https://www.ca.go.ke/contact-us" target="_blank" rel="noopener noreferrer">Contact Page</a>.</p>
                </div>

                <div className="text-center mt-4">
                    <Button variant="primary" onClick={() => navigate("/register")}>Back to Register</Button>
                </div>
            </Card>
        </Container>
    );
};

export default PrivacyPolicy;