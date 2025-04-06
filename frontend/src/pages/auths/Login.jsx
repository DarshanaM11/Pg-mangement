import { useState } from "react";
import { TextField, Button, Typography, Paper, Container } from "@mui/material";
import { toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export const Login = ({ setUserRole }) => {  // Accept setUserRole as prop
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Store token and role in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);  // Get role from backend

            // Update state
            setUserRole(data.role);

            // Redirect based on role
            if (data.role === "user") {
                navigate("/user-dashboard");
            } else if (data.role === "owner") {
                navigate("/owner-dashboard");
            } else if (data.role === "admin") {
                navigate("/admin-dashboard");
            }

            toast.success("Login successful!");
        } catch (error) {
            toast.error(error.message || "Something went wrong!");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="center">
            <div className="main">
                <div className="left-section">
                    <Typography variant="h3" className="welcome-text">Welcome Back!</Typography>
                </div>
                <div className="right-section">
                    <Paper elevation={3} className="auth-container">
                        <Container>
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
                                    value={credentials.email}
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
                                    value={credentials.password}
                                />
                                <Button type="submit" variant="contained" color="primary" fullWidth className="auth-btn">
                                    Login
                                </Button>
                            </form>
                            <Typography className="auth-footer">
                                Don't have an account? <a href="/register">Register</a>
                            </Typography>
                        </Container>
                    </Paper>
                </div>
            </div>
        </div>
    );
};
