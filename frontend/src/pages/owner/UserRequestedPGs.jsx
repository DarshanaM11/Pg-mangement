import { useEffect, useState } from "react";
import { Paper, Typography, CircularProgress, Button } from "@mui/material";
import { toast } from "react-toastify";

const UserRequestedPGs = () => {
    const [pgs, setPgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleDecision = async (pgId, userId, action) => {
        try {
            const res = await fetch(`http://localhost:5001/api/pg/owner/${pgId}/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || `${action} successful`);
                fetchData(); // Refresh the list
            } else {
                toast.error(data.message || "Action failed");
            }
        } catch (error) {
            toast.error("Something went wrong.", error);
        }
    };

    if (loading) return <CircularProgress sx={{ marginTop: 5 }} />;

    return (
        <div style={{ padding: '7%' }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>User Requested PGs</Typography>
            {pgs.map((pg) => (
                <Paper elevation={5} key={pg._id} sx={{ p: 2, mb: 3, backgroundColor: "#3946a958" }}>
                    <Typography sx={{ fontSize: "1.2vw", fontWeight: 'bold', mb: 1 }}>{pg.name} - {pg.location}</Typography>
                    <Typography sx={{ fontSize: "1.1vw", mb: 1 }}><strong>Requests:</strong></Typography>
                    <ul>
                        {pg.requests.map((req, idx) => (
                            <li key={idx} style={{ marginBottom: "0.8rem", fontSize: "1vw" }}>
                                <strong>Name:</strong> {req.username} | <strong>Email:</strong> {req.email} | <strong>Phone:</strong> {req.phone}
                                <div style={{ marginTop: "0.5rem" }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        sx={{ mr: 1 }}
                                        onClick={() => handleDecision(pg._id, req._id, "approve")}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDecision(pg._id, req._id, "reject")}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Paper>
            ))}
        </div>
    );
};

export default UserRequestedPGs;
