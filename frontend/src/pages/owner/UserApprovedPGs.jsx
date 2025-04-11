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

    if (loading) return <CircularProgress sx={{ mt: 5 }} />;

    return (
        <div style={{ padding: '7%' }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>User Approved PGs</Typography>
            {approvedPGs.length === 0 ? (
                <Typography>No bookings have been approved yet.</Typography>
            ) : (
                approvedPGs.map((pg) => (
                    <Paper key={pg._id} sx={{ mb: 3, p: 2, backgroundColor: "#f5f5f5" }}>
                        <Typography variant="h6">{pg.name}</Typography>
                        <Typography>Location: {pg.location}</Typography>
                        <Typography>
                            <strong>Booked By:</strong>{" "}
                            {pg.bookedBy?.username || "N/A"} (
                            {pg.bookedBy?.email || "N/A"})
                        </Typography>
                    </Paper>
                ))
            )}
        </div>
    );
};

export default UserApprovedPGs;
