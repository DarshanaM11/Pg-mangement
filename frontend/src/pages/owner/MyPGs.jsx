import { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import "./MyPGs.css"; // ✅ Add necessary CSS styles

export const MyPGs = () => {
    const [pgs, setPgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPG, setSelectedPG] = useState(null);
    const token = localStorage.getItem("token");
    // const navigate = useNavigate();

    useEffect(() => {
        fetchMyPGs();
    }, []);

    // ✅ Fetch all PGs uploaded by owner
    const fetchMyPGs = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/pg/owner-listings", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch PGs");

            const data = await response.json();
            console.log("Fetched PGs:", data);
            setPgs(data);
        } catch (error) {
            console.error("Error fetching PGs:", error);
            toast.error("Failed to fetch PGs.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle edit button click
    const handleEditClick = (pg) => {
        setSelectedPG(pg);
        setOpenDialog(true);
    };

    // ✅ Handle input change for editing PG
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedPG((prev) => ({
            ...prev,
            [name]: name === "amenities" || name === "images" ? value.split(",").map((item) => item.trim()) : value
        }));
    };

    // ✅ Handle updating PG details
    const handleUpdatePG = async () => {
        if (!selectedPG.name || !selectedPG.location || !selectedPG.price) {
            toast.error("Name, location, and price are required!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/api/pg/update/${selectedPG._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...selectedPG,
                    price: Number(selectedPG.price),
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update PG");

            toast.success(result.message || "PG updated successfully!");
            setOpenDialog(false);
            fetchMyPGs(); // Refresh list
        } catch (error) {
            toast.error(error.message || "Failed to update PG.");
        }
    };

    // ✅ Handle deleting a PG
    const handleDeletePG = async (pgId) => {
        if (!window.confirm("Are you sure you want to delete this PG?")) return;

        try {
            const response = await fetch(`http://localhost:5001/api/pg/delete/${pgId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to delete PG");

            toast.success(result.message || "PG deleted successfully!");
            fetchMyPGs(); // Refresh list
        } catch (error) {
            toast.error(error.message || "Failed to delete PG.");
        }
    };

    return (
        <div className="mypgs-layout">
            <Typography variant="h4" className="title">My PGs</Typography>

            {loading ? (
                <CircularProgress className="loading-spinner" />
            ) : (
                <div className="pg-container">
                    {pgs.length === 0 ? (
                        <Typography>No PGs uploaded yet.</Typography>
                    ) : (
                        pgs.map((pg) => (
                            <Paper key={pg._id} className="pg-card">
                                <div className="pg-info">
                                    <Typography variant="h6">{pg.name}</Typography>
                                    <Typography>Location: {pg.location}</Typography>
                                    <Typography>Price: ₹{pg.price}</Typography>
                                    <Typography>
                                        Status: <strong className={pg.approved ? "approved" : "pending"}>
                                            {pg.approved ? "Approved" : "Pending"}
                                        </strong>
                                    </Typography>
                                </div>
                                <div className="pg-actions">
                                    <IconButton onClick={() => handleEditClick(pg)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeletePG(pg._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </Paper>
                        ))
                    )}
                </div>
            )}

            {/* Edit PG Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Edit PG</DialogTitle>
                <DialogContent>
                    {selectedPG && (
                        <>
                            <TextField label="Name" name="name" fullWidth margin="normal" value={selectedPG.name} onChange={handleInputChange} />
                            <TextField label="Location" name="location" fullWidth margin="normal" value={selectedPG.location} onChange={handleInputChange} />
                            <TextField label="Price" name="price" type="number" fullWidth margin="normal" value={selectedPG.price} onChange={handleInputChange} />
                            <TextField label="Description" name="description" fullWidth multiline rows={3} margin="normal" value={selectedPG.description} onChange={handleInputChange} />
                            <TextField label="Amenities" name="amenities" fullWidth margin="normal" value={selectedPG.amenities.join(", ")} onChange={handleInputChange} />
                            <TextField label="Images" name="images" fullWidth margin="normal" value={selectedPG.images.join(", ")} onChange={handleInputChange} />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdatePG}>Update</Button>
                </DialogActions>
            </Dialog>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        </div>
    );
};
