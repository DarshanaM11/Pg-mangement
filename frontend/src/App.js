import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/adminDashboard";
import PgOwnerDashboard from "./pages/ownerDashboard";
import UserDashboard from "./pages/userDashboard";

const App = () => {
    const user = JSON.parse(localStorage.getItem("pgUser")) || {};

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={user.role === "Admin" ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/pg-owner-dashboard" element={user.role === "PG Owner" ? <PgOwnerDashboard /> : <Navigate to="/" />} />
                <Route path="/user-dashboard" element={user.role === "User" ? <UserDashboard /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
