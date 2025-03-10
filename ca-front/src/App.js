import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthProvider";
import { queryClient } from "./utils/queryClient";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import TokenRequestPage from "./pages/TokenRequestPage";
import UsersPage from "./pages/UsersPage";
import SmsPage from "./pages/SmsPage";
import SingleUserPage from "./pages/SingleUserPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/token-request" element={<TokenRequestPage />} />
            <Route path="/" element={
                <PrivateRoute>
                  <UsersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/sms"
              element={
                <PrivateRoute>
                  <SmsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <PrivateRoute>
                  <SingleUserPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
