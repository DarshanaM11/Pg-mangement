import { NavLink, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./Navbar.css";

export const Navbar = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <AppBar
            position="absolute"
            className={`navbar ${isHome ? "transparent" : ""}`}
            elevation={isHome ? 0 : 4} // Remove shadow when transparent
        >
            <Toolbar className="navbar-container">
                {/* Logo */}
                <Typography variant="h6" className="logo">
                    FindOne
                </Typography>

                {/* Navigation Links */}
                <nav className="cont">
                    <ul className="nav-links">
                        <NavLink to="/" className="nav-link">
                            Home
                        </NavLink>
                        {["About", "Contact"].map((text, index) => (
                            <li key={index}>
                                <NavLink to={`/${text.toLowerCase()}`} className="nav-link">
                                    {text}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sign-In and Sign-Up Buttons */}
                <Box className="auth-buttons">
                    <NavLink to="/login">
                        <Button
                            variant="outlined"
                            sx={{
                                color: "white",
                                borderColor: "white",
                                "&:hover": {
                                    backgroundColor: "white",
                                    color: "black",
                                },
                                fontSize:"0.7vw"
                            }}
                        >
                            Sign In
                        </Button>
                    </NavLink>
                    <NavLink to="/register">
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "darkred",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "darkred",
                                },
                                fontSize:"0.7vw"
                            }}
                        >
                            Sign Up
                        </Button>
                    </NavLink>
                </Box>

            </Toolbar>
        </AppBar>
    );
};
