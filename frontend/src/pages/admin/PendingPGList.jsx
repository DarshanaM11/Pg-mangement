import { useEffect, useState } from "react";
import { Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { toast } from "react-toastify";

const PendingPGList = () => {
    const [pgs, setPgs] = useState([]);
    const [selectedPG, setSelectedPG] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPendingPgs = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/admin/pgs/pending", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch PGs");
                }
                const data = await res.json();
                setPgs(data);
            } catch (error) {
                console.error("Error fetching PGs:", error);
                toast.error("Failed to load PGs");
            }
        };

        fetchPendingPgs();
    }, [token]);

    const handleAction = async (id, action) => {
        try {
            const res = await fetch(`http://localhost:5001/api/admin/pgs/${id}/${action}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to ${action} PG`);
            }

            setPgs(prev => prev.filter(pg => pg._id !== id));

            if (selectedPG?._id === id) {
                setIsModalOpen(false);
            }

            toast.success(`PG ${action === "approve" ? "approved" : "rejected"} successfully`);
        } catch (error) {
            console.error(`Error on ${action}:`, error);
            toast.error(`Failed to ${action} PG`);
        }
    };

    const handleView = (pg) => {
        setSelectedPG(pg);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedPG(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <Typography variant="h4">Pending PG Approvals</Typography>
            {pgs.map(pg => (
                <Paper key={pg._id} style={{ padding: "1rem", margin: "1rem 0" }}>
                    <Typography><strong>Name:</strong> {pg.name}</Typography>
                    <Typography><strong>Owner:</strong> {pg.ownerName}</Typography>
                    <Button variant="contained" onClick={() => handleView(pg)}>View</Button>
                    <Button
                        color="success"
                        variant="contained"
                        onClick={() => handleAction(pg._id, "approve")}
                        style={{ marginLeft: "0.5rem" }}
                    >
                        Approve
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleAction(pg._id, "reject")}
                        style={{ marginLeft: "0.5rem" }}
                    >
                        Reject
                    </Button>
                </Paper>
            ))}

            <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle>PG Details</DialogTitle>
                <DialogContent dividers>
                    {selectedPG && (
                        <>
                            <Typography><strong>Name:</strong> {selectedPG.name}</Typography>
                            <Typography><strong>Description:</strong> {selectedPG.description}</Typography>
                            <Typography><strong>Location:</strong> {selectedPG.location}</Typography>
                            <Typography><strong>Price:</strong> ₹{selectedPG.price}</Typography>
                            <Typography><strong>Amenities:</strong> {selectedPG.amenities?.join(', ')}</Typography>
                            <Typography><strong>Status:</strong> {selectedPG.status}</Typography>
                            <Typography><strong>Owner Name:</strong> {selectedPG.ownerName}</Typography>
                            <Typography><strong>Contact:</strong> {selectedPG.ownerContact}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PendingPGList;