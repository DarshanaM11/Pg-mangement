import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Modal,
    Box,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CustomSlider from "../../components/CustomSlider";
import "./Dashboard.css";

export const UserDashboard = () => {
    const [pgs, setPgs] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApprovedPGs();
    }, []);

    const fetchApprovedPGs = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5001/api/pg/available-approved", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setPgs(data);
        } catch (error) {
            console.error("Error fetching approved PGs:", error);
        }
    };



    const handleDrawerItemClick = (label) => {
        setDrawerOpen(false);
        switch (label) {
            case "Profile":
                setProfileModalOpen(true);
                break;
            case "Requested PGs":
                navigate("/user/requested-pgs");
                break;
            case "Booked PG":
                navigate("/user/booked-pg");
                break;
            case "Wishlist":
                navigate("/user/wishlist");
                break;
            default:
                break;
        }
    };

    const handleViewClick = (pgId) => {
        navigate(`/pg/${pgId}`);
    };

    return (
        <div className="user-dashboard-container">
            {/* Menu Icon to toggle drawer */}
            <IconButton
                onClick={() => setDrawerOpen(true)}
                className="menu-icon"
                style={{ position: "absolute", top: 20, left: 20, zIndex: 1000 }}
            >
                <MenuIcon fontSize="large" />
            </IconButton>

            {/* Drawer Sidebar */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <List style={{ width: 250 }}>
                    {["Profile", "Requested PGs", "Booked PG", "Wishlist"].map((text) => (
                        <ListItem button key={text} onClick={() => handleDrawerItemClick(text)}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Profile Modal */}
            <Modal open={profileModalOpen} onClose={() => setProfileModalOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        width: 400,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        User Profile
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        {/* Replace this with dynamic user data */}
                        Username: John Doe
                        <br />
                        Email: johndoe@example.com
                        <br />
                        Phone: 9876543210
                    </Typography>
                </Box>
            </Modal>

            {/* PG Listings */}
            <div className="user-dashboard">
                {pgs.map((pg) => (
                    <div className="pg-card" key={pg._id} >
                        <CustomSlider>
                            {pg.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5001/uploads/${img}`}
                                    alt={`PG ${index}`}
                                    className="pg-image"
                                />
                            ))}
                        </CustomSlider>

                        <div className="pg-details">
                            <h3>{pg.name}</h3>
                            <p><strong>₹{pg.price}</strong> / month</p>
                            <p>{pg.location}</p>
                        </div>

                        <button className="view-button" onClick={() => handleViewClick(pg._id)}>
                            View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
