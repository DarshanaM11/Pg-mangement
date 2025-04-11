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
    console.log("counts", counts)
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

            // Calculate counts
            const uploadedPGCount = data?.length;
            const approvedPGCount = data?.filter(pg => pg.status === "approved").length;
            const userRequestPGCount = data.filter(
                pg => pg.requests && pg.requests.length > 0 && pg.bookedBy === null
            ).length;
            const userApprovedPGCount = data?.filter(pg => pg.bookedBy !== null).length;

            setCounts({
                uploadedPGCount,
                approvedPGCount,
                userRequestPGCount,
                userApprovedPGCount
            });
        } catch {
            toast.error("Failed to fetch PG stats.");
        } finally {
            setLoading(false);
        }
    };

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

        if (!newPG.name || !newPG.location || !newPG.price || !newPG.contact) {
            toast.error("Name, location, price and contact are required!");
            return;
        }

        const formData = new FormData();
        formData.append("name", newPG.name);
        formData.append("location", newPG.location);
        formData.append("price", newPG.price);
        formData.append("description", newPG.description);

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

    const handleProfileClick = async () => {
        setSidebarOpen(false)
        try {
            const response = await fetch("http://localhost:5001/api/owner/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to fetch owner info");
            const data = await response.json();
            setOwnerInfo(data);
        } catch (error) {
            toast.error("Could not load profile info.", error);
        }
    };

    return (
        <div className="dashboard-layout">
            <div className="upper">
                <div style={{ padding: '1vw' }}>
                    <Button variant="contained" sx={{ fontSize: "0.9vw" }} onClick={handleAddPG}>
                        Add Pg
                    </Button>
                </div>
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
                            <div className="card-header">
                                <Typography variant="h4">Uploaded PGs</Typography>
                                <div className="count-badge">{counts.uploadedPGCount}</div>
                            </div>
                        </Paper>
                        <Paper className="dashboard-card" onClick={() => handleCardClick("approved-pgs")}>
                            <div className="card-header">
                                <Typography variant="h4">Approved PGs</Typography>
                                <div className="count-badge">{counts.approvedPGCount}</div>
                            </div>
                        </Paper>
                        <Paper className="dashboard-card" onClick={() => handleCardClick("user-requested-pgs")}>
                            <div className="card-header">
                                <Typography variant="h4">User Requested PGs</Typography>
                                <div className="count-badge">{counts.userRequestPGCount}</div>
                            </div>
                        </Paper>
                        <Paper className="dashboard-card" onClick={() => handleCardClick("user-approved-pgs")}>
                            <div className="card-header">
                                <Typography variant="h4">User Approved PGs</Typography>
                                <div className="count-badge">{counts.userApprovedPGCount}</div>
                            </div>
                        </Paper>
                    </div>
                )}
            </div>

            <Drawer
                anchor="right"
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                PaperProps={{
                    sx: { width: 300 } // you can adjust this to 350 or 400 as per your design
                }}
            >
                <List>
                    <ListItem >
                        <ListItemText primary="Owner Darshboard" primaryTypographyProps={{ fontSize: 25, display: 'flex', alignItems: 'center' }} />
                    </ListItem>
                    <ListItem button onClick={handleProfileClick}>
                        <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: 18, ml: 2 }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/owner-dashboard/my-pgs")}>
                        <ListItemText primary="My PGs" primaryTypographyProps={{ fontSize: 18, ml: 2 }} />
                    </ListItem>
                    <ListItem button onClick={handleAddPG}>
                        <ListItemText primary="Add PG" primaryTypographyProps={{ fontSize: 18, ml: 2 }} />
                    </ListItem>
                </List>
            </Drawer>


            <Dialog open={ownerInfo !== null} onClose={() => setOwnerInfo(null)}>
                <DialogTitle sx={{ fontSize: "1.5rem", padding: "20px 24px" }}>
                    Owner Profile</DialogTitle>
                <DialogContent sx={{ padding: "24px" }}>
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
