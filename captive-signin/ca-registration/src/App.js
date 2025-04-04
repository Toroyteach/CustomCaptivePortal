import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivacyPolicy from "./components/Privacy";
import Recover from "./components/Recover";
import Register from "./components/Register";
import { QueryProvider } from "./context/QueryContext";

function App() {
  return (
    <Router>
      <QueryProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recover" element={<Recover />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </QueryProvider>
    </Router>
  );
}

export default App;