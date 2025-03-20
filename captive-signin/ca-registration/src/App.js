import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivacyPolicy from "./components/Privacy";
import Recover from "./components/Recover";
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page redirects to Register */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* Available Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Catch-all route: Redirects unknown paths to Register */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Router>
  );
}

export default App;