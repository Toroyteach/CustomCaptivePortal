import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthProvider";
import { queryClient } from "./utils/queryClient";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/auth/LoginPage";
import TokenRequestPage from "./pages/token/TokenRequestPage";
import UsersPage from "./pages/admin/UsersPage";
import SmsPage from "./pages/token/SmsPage";
import SingleUserPage from "./pages/admin/SingleUserPage";
import UserCreatePage from "./pages/admin/UserCreatePage";

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
              path="/users"
              element={
                <PrivateRoute>
                  <UsersPage />
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
            <Route
              path="/users/create"
              element={
                <PrivateRoute>
                  <UserCreatePage />
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
