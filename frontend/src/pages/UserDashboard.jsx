/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Typography, Paper, Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

export const UserDashboard = () => {
    const [pgListings, setPgListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPGs = async () => {
            try {
                const response = await fetch("http://localhost:5001/pg-listings");
                const data = await response.json();
                setPgListings(data);
            } catch (error) {
                toast.error("Failed to fetch PG listings.");
            } finally {
                setLoading(false);
            }
        };

        fetchPGs();
    }, []);

    return (
        <div className="dashboard-container">
            <Typography variant="h4" className="dashboard-title">User Dashboard</Typography>
            {loading ? (
                <CircularProgress className="loading-spinner" />
            ) : (
                <div className="pg-listings">
                    {pgListings.length === 0 ? (
                        <Typography>No PG listings available.</Typography>
                    ) : (
                        pgListings.map((pg) => (
                            <Paper key={pg.id} className="pg-card">
                                <Typography variant="h6">{pg.name}</Typography>
                                <Typography>{pg.location}</Typography>
                                <Typography>Price: ₹{pg.price}/month</Typography>
                                <Button variant="contained" color="primary">
                                    Request Booking
                                </Button>
                            </Paper>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
