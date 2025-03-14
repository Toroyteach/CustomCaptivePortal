import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthProvider";
import { queryClient } from "./utils/queryClient";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/auth/LoginPage";
import TokenRequestPage from "./pages/token/TokenRequestPage";
import UsersPage from "./pages/admin/UsersPage";
import SmsPage from "./pages/token/SmsPage";
import SingleUserPage from "./pages/admin/SingleUserPage";
import UserCreatePage from "./pages/admin/UserCreatePage";
import CustomersList from "./pages/users/CustomersList";
import SingleCustomerPage from "./pages/users/SingleCustomer";
import CreateCustomer from "./pages/users/CreateCustomer";
import SmsLogsList from "./pages/token/SmsPage";
import SingleSmsLog from "./pages/token/SingleSmsPage";
import NetworkDashboard from "./pages/network/NetworkDashboard";
import UnauthorizedPage from "./routes/unauthorized";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={
              <PrivateRoute allowedRoles={["admin"]}>
                <NetworkDashboard />
              </PrivateRoute>
            }
            />
            <Route
              path="/sms"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <SmsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/token-request"
              element={
                <PrivateRoute allowedRoles={["admin", "manager"]}>
                  <TokenRequestPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <UsersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <SingleUserPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/create"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <UserCreatePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <CustomersList />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/:id"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <SingleCustomerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/create"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <CreateCustomer />
                </PrivateRoute>
              }
            />
            <Route path="/sms-logs" element={
              <PrivateRoute allowedRoles={["admin"]}>
                <SmsLogsList />
              </PrivateRoute>
            } />
            <Route path="/sms-logs/:mobile" element={
              <PrivateRoute>
                <SingleSmsLog />
              </PrivateRoute>
            } />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
