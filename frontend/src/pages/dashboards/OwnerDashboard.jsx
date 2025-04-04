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
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export const OwnerDashboard = () => {
    const [counts, setCounts] = useState({
        uploadedPGCount: 0,
        approvedPGCount: 0,
        userRequestPGCount: 0,
        userApprovedPGCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState(null);
    const [newPG, setNewPG] = useState({
        name: "",
        location: "",
        price: "",
        description: "",
        amenities: "",
        image: null,
        contact: ""
    });

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchOwnerStats();
        // fetchOwnerInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPG((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewPG((prev) => ({
            ...prev,
            image: file
        }));
    };

    const fetchOwnerStats = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/pg/owner-listings", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch owner stats");

            const data = await response.json();
            setCounts(data);
        } catch {
            toast.error("Failed to fetch PG stats.");
        } finally {
            setLoading(false);
        }
    };

    // const fetchOwnerInfo = async () => {
    //     try {
    //         const response = await fetch("http://localhost:5001/api/owner/info", {
    //             method: "GET",
    //             headers: { "Authorization": `Bearer ${token}` },
    //         });
    //         if (!response.ok) throw new Error("Failed to fetch owner info");

    //         const data = await response.json();
    //         setOwnerInfo(data);
    //     } catch {
    //         toast.error("Failed to fetch owner info.");
    //     }
    // };

    const handleCardClick = (type) => {
        navigate(`/owner-dashboard/${type}`);
    };

    const handleAddPG = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAddPGSubmit = async (e) => {
        e.preventDefault();
    
        if (!newPG.name || !newPG.location || !newPG.price || !newPG.contact ) {
            toast.error("Name, location, price and contact are required!");
            return;
        }
    
        const formData = new FormData();
        formData.append("name", newPG.name);
        formData.append("location", newPG.location);
        formData.append("price", newPG.price);
        formData.append("description", newPG.description);
    
        // ✅ Ensure amenities is sent as JSON string (array of strings)
        const amenityArray = newPG.amenities
            ? newPG.amenities.split(",").map((a) => a.trim())
            : [];
        formData.append("amenities", JSON.stringify(amenityArray));
    
        formData.append("contact", newPG.contact);
        formData.append("image", newPG.image);
    
        try {
            const response = await fetch("http://localhost:5001/api/pg/add", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                    // ❌ DO NOT set Content-Type here (fetch with FormData handles it automatically)
                },
                body: formData
            });
    
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to add PG");
    
            toast.success(result.message || "PG added successfully!");
            setOpenDialog(false);
            navigate("/owner-dashboard/my-pgs");
        } catch (error) {
            toast.error(error.message || "Failed to add PG.");
        }
    };
    
    const handleProfileClick = () => {
        setOwnerInfo(ownerInfo);
    };

    return (
        <div className="dashboard-layout">
            <div className="upper">
                <div>
                    <IconButton onClick={() => setSidebarOpen(true)}>
                        <MenuIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                </div>
            </div>

            <div>
                {loading ? (
                    <CircularProgress className="loading-spinner" />
                ) : (
                    <div className="card-container">
                        <Paper className="dashboard-card" onClick={() => handleCardClick("my-pgs")}>
                            <Typography variant="h6">Uploaded PGs</Typography>
                            <Typography>{counts.uploadedPGCount}</Typography>
                        </Paper>
                        <Paper className="dashboard-card" onClick={() => handleCardClick("approved-pgs")}>
                            <Typography variant="h6">Approved PGs</Typography>
                            <Typography>{counts.approvedPGCount}</Typography>
                        </Paper>
                        <Paper className="dashboard-card" onClick={() => handleCardClick("user-requested-pgs")}>
                            <Typography variant="h6">User Requested PGs</Typography>
                            <Typography>{counts.userRequestPGCount}</Typography>
                        </Paper>
                        <Paper className="dashboard-card" onClick={() => handleCardClick("user-approved-pgs")}>
                            <Typography variant="h6">User Approved PGs</Typography>
                            <Typography>{counts.userApprovedPGCount}</Typography>
                        </Paper>
                    </div>
                )}
            </div>

            <Drawer anchor="right" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
                <List>
                    <ListItem button onClick={handleProfileClick}>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/owner-dashboard/my-pgs")}>
                        <ListItemText primary="My PGs" />
                    </ListItem>
                    <ListItem button onClick={handleAddPG}>
                        <ListItemText primary="Add PG" />
                    </ListItem>
                </List>
            </Drawer>

            <Dialog open={ownerInfo !== null} onClose={() => setOwnerInfo(null)}>
                <DialogTitle>Owner Profile</DialogTitle>
                <DialogContent>
                    {ownerInfo ? (
                        <>
                            <Typography>Name: {ownerInfo.name}</Typography>
                            <Typography>Email: {ownerInfo.email}</Typography>
                            <Typography>Phone: {ownerInfo.phone}</Typography>
                        </>
                    ) : (
                        <CircularProgress />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOwnerInfo(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add PG</DialogTitle>
                <DialogContent>
                    <TextField label="Name" name="name" fullWidth required margin="normal" onChange={handleInputChange} />
                    <TextField label="Location" name="location" fullWidth required margin="normal" onChange={handleInputChange} />
                    <TextField label="Price" name="price" type="number" fullWidth required margin="normal" onChange={handleInputChange} />
                    <TextField label="Description" name="description" fullWidth multiline rows={3} margin="normal" onChange={handleInputChange} />
                    <TextField label="Amenities (comma separated)" name="amenities" fullWidth margin="normal" onChange={handleInputChange} />
                    <TextField label="Contact" name="contact" fullWidth required margin="normal" onChange={handleInputChange} />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ marginTop: "1rem" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddPGSubmit}>Add PG</Button>
                </DialogActions>
            </Dialog>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
    );
};
