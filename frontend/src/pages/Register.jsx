import { useState } from "react";
import { TextField, Button, Typography, Container, Paper, MenuItem } from "@mui/material";
import "./Auth.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const [user, setUser] = useState({ username: "", email: "", phone: "", password: "", role: "user" });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Register Data:", user);

        try {
            const response = await fetch(`http://localhost:5001/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }
            
            setUser({ username: "", email: "", phone: "", password: "", role: "user" });
            navigate("/login");
            toast.success("Registered successfully!");

            console.log("Response:", data);
        } catch (error) {
            toast.error(error.message || "Something went wrong!");
            console.error("Register error:", error);
        }
    };

    return (
        <div className="center">
            <ToastContainer position="top-right" autoClose={7000} />
            <div className="main">
                <div className="left-section">
                    <Typography variant="h3" className="welcome-text">Welcome to PG Management</Typography>
                </div>
                <div className="right-section">
                    <Paper elevation={3} className="auth-container">
                        <div className="form">
                            <Typography variant="h4" className="auth-title">Register</Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="Username"
                                    name="username"
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={user.username}
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    name="email"
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={user.email}
                                />
                                <TextField
                                    label="Phone"
                                    type="number"
                                    name="phone"
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={user.phone}
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
                                    value={user.password}
                                />
                                <TextField
                                    select
                                    label="Role"
                                    name="role"
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={user.role}
                                >
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="owner">Owner</MenuItem>
                                </TextField>
                                <div className="auth-footer">
                                    <Button type="submit" variant="contained" color="primary" fullWidth className="auth-btn">
                                        Register
                                    </Button>
                                </div>
                            </form>
                            <Typography className="auth-footer">
                                Already have an account? <a href="/login">Login</a>
                            </Typography>
                        </div>
                    </Paper>
                </div>
            </div>
        </div>
    );
};
