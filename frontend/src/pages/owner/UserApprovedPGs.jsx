import { useEffect, useState } from "react";
import { Paper, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const UserApprovedPGs = () => {
    const [approvedPGs, setApprovedPGs] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/pg/owner-listings-with-users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                const bookedPGs = data.filter(pg => pg.bookedBy !== null);
                setApprovedPGs(bookedPGs);
            } catch (err) {
                toast.error("Failed to load approved bookings.", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom>User Approved Bookings</Typography>
            {approvedPGs.map((pg) => (
                <Paper key={pg._id} style={{ marginBottom: 20, padding: 16 }}>
                    <Typography variant="h6">{pg.name}</Typography>
                    <Typography>Location: {pg.location}</Typography>
                    <Typography>
                        <strong>Booked By:</strong> {pg.bookedBy?.userName} ({pg.bookedBy?.userEmail})
                    </Typography>
                </Paper>
            ))}
        </div>
    );
};

export default UserApprovedPGs;
