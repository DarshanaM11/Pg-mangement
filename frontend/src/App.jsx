import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home } from "./pages/main/Home";
import { About } from "./pages/main/About";
import { Contact } from "./pages/main/Contact";
import { Register } from "./pages/auths/Register";
import { Login } from "./pages/auths/Login";
import { UserDashboard } from "./pages/dashboards/UserDashboard";
import { OwnerDashboard } from "./pages/dashboards/OwnerDashboard";
import PgDetails from "./pages/user/PgDetails";
import { RequestedPGs } from "./pages/user/RequestedPGs";
import { BookedPG } from "./pages/user/BookedPG";
import { Wishlist } from "./pages/user/Wishlist";
import { MyPGs } from "./pages/owner/MyPGs";
import UserRequestedPGs from "./pages/owner/UserRequestedPGs";
import UserApprovedPGs from "./pages/owner/UserApprovedPGs";
import ApprovedPGListOfOwner from "./pages/owner/ApprovedPGList";
import { AdminDashboard } from "./pages/dashboards/AdminDashboard";
import OwnerList from "./pages/admin/OwnerList";
import UserList from "./pages/admin/UserList";
import PendingPGList from "./pages/admin/PendingPGList";
import ApprovedPGList from "./pages/admin/ApprovedPGList";
import RejectedPGList from "./pages/admin/RejectedPGList";
import { Navbar } from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Function to get user role from localStorage
const getUserRole = () => localStorage.getItem("role");

// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
    const role = getUserRole();
    return allowedRoles.includes(role) ? element : <Navigate to="/login" />;
};

const App = () => {
    const [userRole, setUserRole] = useState(getUserRole());
    const [isDashboardPage, setIsDashboardPage] = useState(false);

    useEffect(() => {
        setUserRole(getUserRole());

        const path = window.location.pathname;
        setIsDashboardPage(path.includes("dashboard"));
    }, [userRole]);

    return (
        <>
            <BrowserRouter>

                <Navbar isTransparent={isDashboardPage} />
                <div style={{ paddingTop: "80px" }}>
                    <Routes >
                        {/* Public Pages */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login setUserRole={setUserRole} />} />

                        {/* User Dashboard */}
                        <Route path="/user-dashboard" element={<ProtectedRoute element={<UserDashboard />} allowedRoles={["user"]} />} />
                        <Route path="/pg/:id" element={<ProtectedRoute element={<PgDetails />} allowedRoles={["user"]} />} />
                        <Route path="/user/requested-pgs" element={<ProtectedRoute element={<RequestedPGs />} allowedRoles={["user"]} />} />
                        <Route path="/user/booked-pg" element={<ProtectedRoute element={<BookedPG />} allowedRoles={["user"]} />} />
                        <Route path="/user/wishlist" element={<ProtectedRoute element={<Wishlist />} allowedRoles={["user"]} />} />



                        {/* Owner Dashboard */}
                        <Route path="/owner-dashboard" element={<ProtectedRoute element={<OwnerDashboard />} allowedRoles={["owner"]} />} />
                        <Route path="/owner-dashboard/my-pgs" element={<ProtectedRoute element={<MyPGs />} allowedRoles={["owner"]} />} />
                        <Route path="/owner-dashboard/approved-pgs" element={<ProtectedRoute element={<ApprovedPGListOfOwner />} allowedRoles={["owner"]} />} />
                        <Route path="/owner-dashboard/user-requested-pgs" element={<ProtectedRoute element={<UserRequestedPGs />} allowedRoles={["owner"]} />} />
                        <Route path="/owner-dashboard/user-approved-pgs" element={<ProtectedRoute element={<UserApprovedPGs />} allowedRoles={["owner"]} />} />




                        {/* Admin Dashboard and Subpages */}
                        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
                        <Route path="/admin-dashboard/owners" element={<ProtectedRoute element={<OwnerList />} allowedRoles={["admin"]} />} />
                        <Route path="/admin-dashboard/users" element={<ProtectedRoute element={<UserList />} allowedRoles={["admin"]} />} />
                        <Route path="/admin-dashboard/pending-pgs" element={<ProtectedRoute element={<PendingPGList />} allowedRoles={["admin"]} />} />
                        <Route path="/admin-dashboard/approved-pgs" element={<ProtectedRoute element={<ApprovedPGList />} allowedRoles={["admin"]} />} />
                        <Route path="/admin-dashboard/rejected-pgs" element={<ProtectedRoute element={<RejectedPGList />} allowedRoles={["admin"]} />} />

                    </Routes>
                </div>
                <ToastContainer position="top-right" autoClose={3000} />

            </BrowserRouter>
        </>
    );
};

export default App;
