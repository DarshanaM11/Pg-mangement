import { useState } from "react";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";
import "./Auth.css";

export const Register = () => {
    const [user, setUser] = useState({ username: "", email: "",phone:"", password: "" });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Register Data:", user);
    };

    return (
        <div className="center">
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
