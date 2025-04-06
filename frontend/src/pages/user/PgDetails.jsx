import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import CustomSlider from '../../components/CustomSlider';
import './PgDetails.css';

const PgDetails = () => {
    const { id } = useParams();
    const [pg, setPg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRequested, setIsRequested] = useState(false);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchPGDetails();
    }, []);

    const fetchPGDetails = async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/pg/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setPg(data);

            if (userId && data.requests?.includes(userId)) {
                setIsRequested(true);
            }

        } catch (error) {
            console.error("Error fetching PG details:", error);
            toast.error("Failed to fetch PG details.");
        } finally {
            setLoading(false);
        }
    };

    const handleBookingRequest = async () => {
        if (!token) {
            toast.warn("You must be logged in to book a PG.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5001/api/pg/request/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ pgId: pg._id }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Requested successfully!");
                setIsRequested(true);
            } else {
                toast.error(data.message || "Booking request failed.");
            }
        } catch (err) {
            console.error("Error requesting booking:", err);
            toast.error("Something went wrong.");
        }
    };

    if (loading) return <div className="pg-loading">Loading...</div>;
    if (!pg) return <div className="pg-error">PG not found.</div>;

    return (
        <div className="pg-details-container">
            <ToastContainer position="top-right" autoClose={3000} />

            <CustomSlider>
                {pg.images.map((img, index) => (
                    <img
                        key={index}
                        src={`http://localhost:5001/uploads/${img}`}
                        alt={`PG ${index}`}
                        className="pg-image-full"
                    />
                ))}
            </CustomSlider>

            <div className="pg-content">
                <h1>{pg.name}</h1>
                <p><strong>Price:</strong> ₹{pg.price} / month</p>
                <p><strong>Location:</strong> {pg.location}</p>
                <p><strong>Description:</strong> {pg.description}</p>

                {pg.amenities?.length > 0 && (
                    <div className="pg-amenities">
                        <strong>Amenities:</strong>
                        <ul>
                            {pg.amenities.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="pg-owner">
                    <p><strong>Owner Contact:</strong> {pg.contact}</p>
                </div>

                {isRequested ? (
                    <p className="booking-status">
                        Booking Request Sent to Owner Successfully
                    </p>
                ) : (
                    <button className="book-button" onClick={handleBookingRequest}>
                        Request to Book PG
                    </button>
                )}
            </div>
        </div>
    );
};

export default PgDetails;
