import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSlider from "../../components/CustomSlider";
// import "./Dashboard.css";

export const BookedPG = () => {
    const [bookedPG, setBookedPG] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookedPG = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5001/api/user/booked-pg", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setBookedPG(data);
            } catch (err) {
                console.error("Error fetching booked PG", err);
            }
        };

        fetchBookedPG();
    }, []);

    return (
        <div className="user-dashboard">
            {!bookedPG ? (
                <p>No PG booked yet.</p>
            ) : (
                <div className="pg-card" key={bookedPG._id}>
                    <CustomSlider>
                        {bookedPG.images.map((img, i) => (
                            <img
                                key={i}
                                src={`http://localhost:5001/uploads/${img}`}
                                className="pg-image"
                                alt={`Booked PG ${i}`}
                            />
                        ))}
                    </CustomSlider>
                    <div className="pg-details">
                        <h3>{bookedPG.name}</h3>
                        <p><strong>₹{bookedPG.price}</strong> / month</p>
                        <p>{bookedPG.location}</p>
                    </div>
                    <button className="view-button" onClick={() => navigate(`/pg/${bookedPG._id}`)}>
                        View
                    </button>
                </div>
            )}
        </div>
    );
};
