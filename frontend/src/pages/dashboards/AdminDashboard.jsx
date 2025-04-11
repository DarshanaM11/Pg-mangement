import { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    CircularProgress,
    Grid,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

export const AdminDashboard = () => {
    const [pgStats, setPgStats] = useState({ approved: 0, pending: 0, rejected: 0 });
    const [ownerCount, setOwnerCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [totalPGs, setTotalPGs] = useState(0);
    const [bookedPGs, setBookedPGs] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/reports", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Unauthorized or failed fetch");
            }

            const data = await response.json();

            // Simulated structure; update based on actual API
            setTotalPGs(data.totalPGs || 0);
            setBookedPGs(data.bookedPGs || 0);

            // Example additional stats if backend supports it
            setPgStats({
                approved: data.approvedPGs || 0,
                pending: data.pendingPGs || 0,
                rejected: data.rejectedPGs || 0,
            });

            setOwnerCount(data.ownerCount || 0);
            setUserCount(data.userCount || 0);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Failed to fetch dashboard stats");
        } finally {
            setLoading(false);
        }
    };

    const pgStatusPieData = {
        labels: ["Approved", "Pending", "Rejected"],
        datasets: [
            {
                label: "PG Status",
                data: [pgStats.approved, pgStats.pending, pgStats.rejected],
                backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
                borderWidth: 1,
            },
        ],
    };

    const bookingPieData = {
        labels: ["Booked PGs", "Available PGs"],
        datasets: [
            {
                data: [bookedPGs, totalPGs - bookedPGs],
                backgroundColor: ["#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#36A2EB", "#FFCE56"],
            },
        ],
    };

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div className="dashboard-layout">
            <div className="upper">
                <IconButton onClick={() => setSidebarOpen(true)}>
                    <MenuIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <Typography variant="h4" className="dashboard-title">Admin Dashboard</Typography>
            </div>

            {loading ? (
                <CircularProgress className="loading-spinner" />
            ) : (
                <Grid container spacing={3} className="card-container">
                    <Grid item xs={12} md={6}>
                        <Paper className="dashboard-card">
                            <Typography variant="h6">PG Status Overview</Typography>
                            <Pie data={pgStatusPieData} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className="dashboard-card">
                            <Typography variant="h6">Booking Overview</Typography>
                            <Pie data={bookingPieData} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Paper className="dashboard-card" onClick={() => handleCardClick("/admin-dashboard/owners")}>
                            <Typography variant="h6">Total Owners</Typography>
                            <Typography variant="h5">{ownerCount}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Paper className="dashboard-card" onClick={() => handleCardClick("/admin-dashboard/users")}>
                            <Typography variant="h6">Total Users</Typography>
                            <Typography variant="h5">{userCount}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Paper className="dashboard-card" onClick={() => handleCardClick("/admin-dashboard/pending-pgs")}>
                            <Typography variant="h6">Pending PGs</Typography>
                            <Typography variant="h5">{pgStats.pending}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
                <List>
                    <ListItem button onClick={() => handleCardClick("/admin-dashboard")}>
                        <ListItemText primary="Dashboard Home" />
                    </ListItem>
                    <ListItem button onClick={() => handleCardClick("/admin-dashboard/owners")}>
                        <ListItemText primary="Owner List" />
                    </ListItem>
                    <ListItem button onClick={() => handleCardClick("/admin-dashboard/users")}>
                        <ListItemText primary="User List" />
                    </ListItem>
                    <ListItem button onClick={() => handleCardClick("/admin-dashboard/pending-pgs")}>
                        <ListItemText primary="Pending PGs" />
                    </ListItem>
                    <ListItem button onClick={() => handleCardClick("/admin-dashboard/approved-pgs")}>
                        <ListItemText primary="Approved PGs" />
                    </ListItem>
                    <ListItem button onClick={() => handleCardClick("/admin-dashboard/rejected-pgs")}>
                        <ListItemText primary="Rejected PGs" />
                    </ListItem>
                </List>
            </Drawer>

        </div>
    );
};
