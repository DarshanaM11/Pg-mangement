import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./Navbar.css";
import '@fontsource/dancing-script';

export const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/"; // Check if on home page

    // Check if user is logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <AppBar
            position="fixed"
            className={`navbar ${isHome ? "transparent" : ""}`}  // Apply transparent class on home page
            elevation={isHome ? 0 : 4} // Remove shadow when transparent
        >
            <Toolbar className="navbar-container">
                {/* Logo */}
                <Typography variant="h6" className="logo" sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
                    {isHome ?
                        <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.5vw', marginTop: '1rem', color: "#c9d1d8", marginLeft: "2vw" }}>Roomora</p>
                        :
                        <>
                            <img
                                src="/images/logo.png"
                                alt="Roomora Logo"
                                style={{ height: "60px", marginRight: "0.2rem", marginLeft: "50px" }}
                            />
                            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.5rem', marginTop: '1rem', color: "#c9d1d8" }}>Roomora</p>
                        </>

                    }

                </Typography>

                {/* Navigation Links */}{isHome &&
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
                }


                {/* Role-Based Navigation */}
                {token ? (
                    <Box className="auth-buttons">
                        {role === "user" && (
                            <NavLink to="/user-dashboard">
                                <Button variant="contained" sx={{ fontSize: "0.7vw" }}>
                                    User Dashboard
                                </Button>
                            </NavLink>
                        )}
                        {role === "owner" && (
                            <NavLink to="/owner-dashboard">
                                <Button variant="contained" sx={{ fontSize: "0.7vw" }}>
                                    Owner Dashboard
                                </Button>
                            </NavLink>
                        )}
                        {role === "admin" && (
                            <NavLink to="/admin-dashboard">
                                <Button variant="contained" sx={{ fontSize: "0.7vw" }}>
                                    Admin Dashboard
                                </Button>
                            </NavLink>
                        )}
                        <Button
                            variant="outlined"
                            sx={{
                                color: "white",
                                borderColor: "white",
                                "&:hover": {
                                    backgroundColor: "white",
                                    color: "black",
                                },
                                fontSize: "0.7vw",
                                marginLeft: "1rem",
                            }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                ) : (
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
                                    fontSize: "0.7vw",
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
                                    fontSize: "0.7vw",
                                }}
                            >
                                Sign Up
                            </Button>
                        </NavLink>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};
