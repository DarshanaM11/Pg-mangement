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
import "./MyPGs.css";

export const MyPGs = () => {
    const [pgs, setPgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPG, setSelectedPG] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchMyPGs();
    }, []);

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
            setPgs(data);
        } catch (error) {
            console.error("Error fetching PGs:", error);
            toast.error("Failed to fetch PGs.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (pg) => {
        setSelectedPG({ ...pg, amenities: pg.amenities?.join(", ") || "" });
        setImageFiles([]);
        setOpenDialog(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedPG((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
    };

    const handleUpdatePG = async () => {
        if (!selectedPG.name || !selectedPG.location || !selectedPG.price) {
            toast.error("Name, location, and price are required!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", selectedPG.name);
            formData.append("location", selectedPG.location);
            formData.append("price", selectedPG.price);
            formData.append("description", selectedPG.description || "");
            formData.append("amenities", selectedPG.amenities);
            imageFiles.forEach((file) => {
                formData.append("images", file); // ✅ name should match multer field
            });

            const response = await fetch(`http://localhost:5001/api/pg/update/${selectedPG._id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update PG");

            toast.success(result.message || "PG updated successfully!");
            setOpenDialog(false);
            setImageFiles([]);
            fetchMyPGs();
        } catch (error) {
            toast.error(error.message || "Failed to update PG.");
        }
    };

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
            fetchMyPGs();
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
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit PG</DialogTitle>
                <DialogContent>
                    {selectedPG && (
                        <>
                            <TextField
                                label="Name"
                                name="name"
                                fullWidth
                                margin="normal"
                                value={selectedPG.name}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Location"
                                name="location"
                                fullWidth
                                margin="normal"
                                value={selectedPG.location}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Price"
                                name="price"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={selectedPG.price}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                multiline
                                rows={3}
                                margin="normal"
                                value={selectedPG.description}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Amenities (comma separated)"
                                name="amenities"
                                fullWidth
                                margin="normal"
                                value={selectedPG.amenities}
                                onChange={handleInputChange}
                            />

                            {/* Image File Upload */}
                            <input
                                type="file"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ marginTop: "16px" }}
                            />

                            {/* Image Previews */}
                            {selectedPG.images.map((imgUrl, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                        border: "1px solid #ddd",
                                        backgroundColor: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src={
                                            imgUrl.startsWith("http")
                                                ? imgUrl
                                                : `http://localhost:5001/uploads/${imgUrl}`
                                        }
                                        alt={`PG ${index}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdatePG} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        </div>
    );
};
