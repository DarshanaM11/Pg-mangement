import { useEffect, useState } from "react";
import { Paper, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const UserRequestedPGs = () => {
    const [pgs, setPgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/pg/owner-listings-with-users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                const requestedPGs = data.filter(pg => pg.requests && pg.requests.length > 0);
                setPgs(requestedPGs);
            } catch (err) {
                toast.error("Failed to load requested PGs.", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom>User Requested PGs</Typography>
            {pgs.map((pg) => (
                <Paper key={pg._id} style={{ marginBottom: 20, padding: 16 }}>
                    <Typography variant="h6">{pg.name}</Typography>
                    <Typography>Location: {pg.location}</Typography>
                    <Typography>Requests:</Typography>
                    <ul>
                        {pg.requests.map((req, idx) => (
                            <li key={idx}>
                                <strong>Name:</strong> {req.userName} |
                                <strong> Email:</strong> {req.userEmail} |
                                <strong> Phone:</strong> {req.userPhone}
                            </li>
                        ))}
                    </ul>
                </Paper>
            ))}
        </div>
    );
};

export default UserRequestedPGs;
