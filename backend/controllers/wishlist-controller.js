const User = require("../models/user-model");
const PG = require("../models/pg-model");

// Add PG to wishlist
const addToWishlist = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only users can add PGs to wishlist" });
        }

        const { pgId } = req.params;
        const pg = await PG.findById(pgId);
        if (!pg) return res.status(404).json({ message: "PG not found" });

        if (req.user.wishlist.includes(pgId)) {
            return res.status(400).json({ message: "PG already in wishlist" });
        }

        req.user.wishlist.push(pgId);
        await req.user.save();

        res.status(200).json({ message: "PG added to wishlist" });

    } catch (error) {
        res.status(500).json({ message: "Error adding to wishlist", error });
    }
};

// Remove PG from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only users can remove PGs from wishlist" });
        }

        const { pgId } = req.params;
        req.user.wishlist = req.user.wishlist.filter(id => id.toString() !== pgId);
        await req.user.save();

        res.status(200).json({ message: "PG removed from wishlist" });

    } catch (error) {
        res.status(500).json({ message: "Error removing from wishlist", error });
    }
};

// Get wishlist
const getWishlist = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only users can view wishlist" });
        }

        const wishlist = await User.findById(req.user._id).populate("wishlist");
        res.status(200).json(wishlist.wishlist);

    } catch (error) {
        res.status(500).json({ message: "Error fetching wishlist", error });
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
