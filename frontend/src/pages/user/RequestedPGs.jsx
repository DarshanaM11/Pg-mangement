import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSlider from "../../components/CustomSlider";
// import "./Dashboard.css";

export const RequestedPGs = () => {
    const [requestedPGs, setRequestedPGs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequestedPGs = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5001/api/user/requested-pgs", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setRequestedPGs(data);
            } catch (err) {
                console.error("Error fetching requested PGs", err);
            }
        };

        fetchRequestedPGs();
    }, []);

    return (
        <div className="user-dashboard">
            {requestedPGs.length === 0 ? (
                <p>No requested PGs found.</p>
            ) : (
                requestedPGs.map((pg) => (
                    <div className="pg-card" key={pg._id}>
                        <CustomSlider>
                            {pg.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={`http://localhost:5001/uploads/${img}`}
                                    className="pg-image"
                                    alt={`Requested PG ${i}`}
                                />
                            ))}
                        </CustomSlider>
                        <div className="pg-details">
                            <h3>{pg.name}</h3>
                            <p><strong>₹{pg.price}</strong> / month</p>
                            <p>{pg.location}</p>
                        </div>
                        <button className="view-button" onClick={() => navigate(`/pg/${pg._id}`)}>
                            View
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};
