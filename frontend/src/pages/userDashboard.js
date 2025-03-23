import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("pgUser");
        navigate("/");
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h4" gutterBottom>User Dashboard</Typography>
                <Typography variant="body1">Browse and request PGs.</Typography>
                <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 3 }}>
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default UserDashboard;
