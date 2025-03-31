import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { UserDashboard } from "./pages/UserDashboard";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Navbar } from "./components/Navbar";

// Function to get user role from localStorage
const getUserRole = () => localStorage.getItem("role");

// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
    const role = getUserRole();
    return allowedRoles.includes(role) ? element : <Navigate to="/login" />;
};

const App = () => {
    // eslint-disable-next-line no-unused-vars
    const [userRole, setUserRole] = useState(getUserRole());
    const [isDashboardPage, setIsDashboardPage] = useState(false);

    useEffect(() => {
        setUserRole(getUserRole()); // Update role when localStorage changes

        // Update dashboard page status based on the route
        const path = window.location.pathname;
        setIsDashboardPage(path.includes("dashboard"));
    }, [userRole]);

    return (
        <BrowserRouter>
            <Navbar isTransparent={isDashboardPage} /> {/* Pass transparency flag */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setUserRole={setUserRole} />} />

                {/* Protected Routes for Dashboards */}
                <Route path="/user-dashboard" element={<ProtectedRoute element={<UserDashboard />} allowedRoles={["user"]} />} />
                <Route path="/owner-dashboard" element={<ProtectedRoute element={<OwnerDashboard />} allowedRoles={["owner"]} />} />
                <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
