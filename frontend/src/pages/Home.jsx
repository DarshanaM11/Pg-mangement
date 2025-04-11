import { Button } from "@mui/material";
import "./Home.css";

export const Home = () => {
  return (
    <section className="home-section">
      <h1 className="home-title">Find Your Perfect PG Today</h1>
      <p className="home-subtitle">
        Browse the best paying guest accommodations with ease.
      </p>
      <Button variant="contained" color="primary" className="cta-button">
        Get Started
      </Button>
    </section>
  );
};
