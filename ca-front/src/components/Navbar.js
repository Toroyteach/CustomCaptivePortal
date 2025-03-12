import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customersDropdownOpen, setCustomersDropdownOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>

        {/* Users Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="hover:text-gray-300"
          >
            Users ▼
          </button>
          {dropdownOpen && (
            <div className="absolute bg-gray-700 mt-2 w-40 rounded shadow-lg">
              <Link to="/users" className="block px-4 py-2 hover:bg-gray-600">All Users</Link>
              <Link to="/users/create" className="block px-4 py-2 hover:bg-gray-600">Create User</Link>
            </div>
          )}
        </div>

        {/* Customers Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCustomersDropdownOpen(!customersDropdownOpen)}
            className="hover:text-gray-300"
          >
            Customers ▼
          </button>
          {customersDropdownOpen && (
            <div className="absolute bg-gray-700 mt-2 w-40 rounded shadow-lg">
              <Link to="/customers" className="block px-4 py-2 hover:bg-gray-600">All Customers</Link>
              <Link to="/customers/:id" className="block px-4 py-2 hover:bg-gray-600">Customer Details</Link>
            </div>
          )}
        </div>

        <Link to="/sms" className="hover:text-gray-300">SMS Sent Log</Link>
        <Link to="/token-request" className="hover:text-gray-300">Token Request</Link>
      </div>

      <div>
        {user ? (
          <>
            <span className="mr-4">{user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;