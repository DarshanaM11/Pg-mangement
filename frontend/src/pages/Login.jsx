import { useState } from "react";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";
import "./Auth.css";
import { Navbar } from "../components/Navbar";

export const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Credentials:", credentials);
    };

    return (<>
        <div className="center">
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
