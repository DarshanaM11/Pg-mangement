/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Button,
    CircularProgress,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

export const OwnerDashboard = () => {

    const [pgs, setPgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newPG, setNewPG] = useState({
        name: "",
        location: "",
        price: "",
        description: "",
        amenities: [],
        images: [],
        contact: ""  // ✅ Added contact field
    });
    const token = localStorage.getItem("token");
    

    useEffect(() => {
        fetchOwnerPGs();
    }, []);

    const fetchOwnerPGs = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/pg/owner-listings", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });            const data = await response.json();
            setPgs(data);
        } catch (error) {
            toast.error("Failed to fetch PGs.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setNewPG((prev) => ({
            ...prev,
            [name]: name === "amenities" || name === "images" ? value.split(",").map((item) => item.trim()) : value
        }));
    };
    
    const handleAddPG = async () => {
        if (!newPG.name || !newPG.location || !newPG.price || !newPG.contact) {
            toast.error("Name, location, price, and contact are required!");
            return;
        }
    
    
        try {
            const response = await fetch("http://localhost:5001/api/pg/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newPG,
                    price: Number(newPG.price) // ✅ Ensure price is a number
                })
            });
    
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to add PG");
    
            toast.success(result.message || "PG added successfully!");
            fetchOwnerPGs();
            setOpenDialog(false);
            setNewPG({ name: "", location: "", price: "", description: "", amenities: [], images: [], contact: "" });
    
        } catch (error) {
            toast.error(error.message || "Failed to add PG.");
        }
    };
    
    

    return (
        <div className="dashboard-layout">
            {/* Main Content */}
            <div className="dashboard-content">
                <IconButton className="menu-icon" onClick={() => setSidebarOpen(true)}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h4" className="dashboard-title">Owner Dashboard</Typography>

                <Button variant="contained" color="primary" className="add-pg-btn" onClick={() => setOpenDialog(true)}>
                    Add PG
                </Button>

                {loading ? (
                    <CircularProgress className="loading-spinner" />
                ) : (
                    <div className="pg-listings">
                        {pgs.length === 0 ? (
                            <Typography>No PGs added yet.</Typography>
                        ) : (
                            pgs.map((pg) => (
                                <Paper key={pg.id} className="pg-card">
                                    <Typography variant="h6">{pg.name}</Typography>
                                    <Typography>Status: {pg.approved ? "Approved" : "Pending"}</Typography>
                                </Paper>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Right-Side Navigation */}
            <Drawer anchor="right" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
                <List>
                    <ListItem button>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="My PGs" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Add PG Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add PG</DialogTitle>
                <DialogContent>
                    <TextField label="Name" name="name" fullWidth required margin="normal" onChange={handleInputChange} />
                    <TextField label="Location" name="location" fullWidth required margin="normal" onChange={handleInputChange} />
                    <TextField label="Price" name="price" type="number" fullWidth required margin="normal" onChange={handleInputChange} />
                    <TextField label="Description" name="description" fullWidth multiline rows={3} margin="normal" onChange={handleInputChange} />
                    <TextField label="Amenities (comma-separated)" name="amenities" fullWidth margin="normal" onChange={handleInputChange} />
                    <TextField label="Image URL" name="images" fullWidth margin="normal" onChange={handleInputChange} />
                    <TextField label="Contact Number" name="contact" fullWidth required margin="normal" onChange={handleInputChange} /> {/* ✅ Added contact field */}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddPG} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        </div>
    );
};
