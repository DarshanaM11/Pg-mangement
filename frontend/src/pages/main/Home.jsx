import { Button } from "@mui/material";
import "./Home.css";

export const Home = () => {
  return (
    <section className="home-section">
      <div className="main-div">
        <div>
          <img
            src="/images/logo.png"
            alt="Roomora Logo"
          // style={{ height: "60px", marginRight: "0.2rem", marginLeft: "50px" }}
          />
        </div>
        <div className="text-div">
          <h1 className="home-title">Find Your Perfect PG Today</h1>
          <p className="home-subtitle">
            Browse the best paying guest accommodations with ease.
          </p>
          {/* <Button variant="contained" color="primary" className="cta-button">
            Get Started
          </Button> */}
        </div>

      </div>

    </section>
  );
};
