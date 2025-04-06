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
    const [isWishlisted, setIsWishlisted] = useState(false);

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

            // Check if this PG is in the user's wishlist
            const wishlistRes = await fetch("http://localhost:5001/api/user/wishlist", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const wishlistData = await wishlistRes.json();
            const isInWishlist = wishlistData.some(pgItem => pgItem._id === data._id);
            setIsWishlisted(isInWishlist);

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

    const handleAddToWishlist = async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/user/wishlist/${pg._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Added to wishlist!");
                setIsWishlisted(true);
            } else {
                toast.error(data.message || "Failed to add to wishlist.");
            }
        } catch (err) {
            console.error("Error adding to wishlist:", err);
            toast.error("Something went wrong.");
        }
    };

    const handleRemoveFromWishlist = async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/user/wishlist/${pg._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Removed from wishlist!");
                setIsWishlisted(false);
            } else {
                toast.error(data.message || "Failed to remove from wishlist.");
            }
        } catch (err) {
            console.error("Error removing from wishlist:", err);
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

                {isWishlisted ? (
                    <button className="wishlist-button remove" onClick={handleRemoveFromWishlist}>
                        Remove from Wishlist
                    </button>
                ) : (
                    <button className="wishlist-button" onClick={handleAddToWishlist}>
                        Add to Wishlist
                    </button>
                )}
            </div>
        </div>
    );
};

export default PgDetails;
