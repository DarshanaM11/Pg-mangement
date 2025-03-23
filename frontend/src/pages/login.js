import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, MenuItem, Typography, Box } from "@mui/material";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Simulating API call for login (replace with actual API)
            const response = await axios.post("http://localhost:5000/api/login", {
                username,
                password,
                role,
            });

            if (response.data.success) {
                localStorage.setItem("pgUser", JSON.stringify({ role }));
                
                // Redirect based on role
                if (role === "Admin") navigate("/admin-dashboard");
                else if (role === "PG Owner") navigate("/pg-owner-dashboard");
                else navigate("/user-dashboard");
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5, textAlign: "center" }}>
                <Typography variant="h5">Login</Typography>
                <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    select
                    label="Select Role"
                    variant="outlined"
                    margin="normal"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="PG Owner">PG Owner</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                </TextField>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
