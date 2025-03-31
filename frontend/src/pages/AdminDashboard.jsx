import { useEffect, useState } from "react";
import { Typography, Paper, Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

export const AdminDashboard = () => {
    const [pgRequests, setPgRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPgRequests = async () => {
            try {
                const response = await fetch("http://localhost:5001/admin-pg-requests");
                const data = await response.json();
                setPgRequests(data);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error("Failed to fetch PG requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchPgRequests();
    }, []);

    return (
        <div className="dashboard-container">
            <Typography variant="h4" className="dashboard-title">Admin Dashboard</Typography>
            {loading ? (
                <CircularProgress className="loading-spinner" />
            ) : (
                <div className="pg-listings">
                    {pgRequests.length === 0 ? (
                        <Typography>No pending PG approvals.</Typography>
                    ) : (
                        pgRequests.map((pg) => (
                            <Paper key={pg.id} className="pg-card">
                                <Typography variant="h6">{pg.name}</Typography>
                                <Typography>Owner: {pg.ownerName}</Typography>
                                <Button variant="contained" color="success">
                                    Approve
                                </Button>
                                <Button variant="contained" color="error">
                                    Reject
                                </Button>
                            </Paper>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
