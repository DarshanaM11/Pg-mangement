import { useState } from "react";
import { TextField, Button, Typography, Container, Paper, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import "./Auth.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "", role: "" });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.role) {
            toast.error("Role selection is required!");
            return;
        }
        console.log("Login Credentials:", credentials);

        try {
            const response = await fetch(`http://localhost:5001/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json(); // Parse response

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            if (response.ok) {
                setCredentials({ email: "", password: "", role: "" });
                setTimeout(() => {
                    navigate("/about");
                }, 1000); // Delay for 1 second to allow toast to appear
            }

            toast.success("Login successful!");
            console.log("Response:", data);
        } catch (error) {
            toast.error(error.message || "Something went wrong!");
            console.error("Login error:", error);
        }
    };

    return (<>
        <div className="center">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="main">
                <Container maxWidth="sm">
                    <Paper elevation={3} className="auth-container">
                        <Typography variant="h4" className="auth-title">Login</Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                fullWidth
                                required
                                margin="normal"
                                variant="outlined"
                                onChange={handleChange}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                name="password"
                                fullWidth
                                required
                                margin="normal"
                                variant="outlined"
                                onChange={handleChange}
                            />
                            <FormControl fullWidth required margin="normal" variant="outlined">
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role"
                                    value={credentials.role}
                                    onChange={handleChange}
                                    label="Role"
                                >
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="owner">Owner</MenuItem>
                                </Select>
                            </FormControl>
                            <Button type="submit" variant="contained" color="primary" fullWidth className="auth-btn">
                                Login
                            </Button>
                        </form>
                        <Typography className="auth-footer">
                            Don't have an account? <a href="/register">Register</a>
                        </Typography>
                    </Paper>
                </Container>
            </div>
        </div>
    </>
    );
};
