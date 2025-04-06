import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSlider from "../../components/CustomSlider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./Dashboard.css";

export const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/user/wishlist", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setWishlist(data);
        } catch (err) {
            console.error("Error fetching wishlist", err);
            toast.error("Failed to load wishlist.");
        }
    };

    const removeFromWishlist = async (pgId) => {
        try {
            const res = await fetch(`http://localhost:5001/api/user/wishlist/${pgId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Removed from wishlist.");
                setWishlist((prev) => prev.filter((pg) => pg._id !== pgId));
            } else {
                toast.error(data.message || "Failed to remove.");
            }
        } catch (err) {
            console.error("Error removing PG from wishlist:", err);
            toast.error("Something went wrong.");
        }
    };

    return (
        <div className="user-dashboard">
            <ToastContainer position="top-right" autoClose={3000} />

            {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                wishlist.map((pg) => (
                    <div className="pg-card" key={pg._id}>
                        <CustomSlider>
                            {pg.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={`http://localhost:5001/uploads/${img}`}
                                    className="pg-image"
                                    alt={`Wishlist PG ${i}`}
                                />
                            ))}
                        </CustomSlider>
                        <div className="pg-details">
                            <h3>{pg.name}</h3>
                            <p><strong>₹{pg.price}</strong> / month</p>
                            <p>{pg.location}</p>
                        </div>
                        <div className="pg-actions">
                            <button
                                className="view-button"
                                onClick={() => navigate(`/pg/${pg._id}`)}
                            >
                                View
                            </button>
                            <button
                                className="remove-button"
                                onClick={() => removeFromWishlist(pg._id)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
