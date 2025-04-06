const User = require("../models/user-model");
const PG = require("../models/pg-model");


const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // from verifyToken middleware

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET: PGs user has requested to book
const getRequestedPGs = async (req, res) => {
    try {
        const requestedPGs = await PG.find({ requests: req.user._id }).populate("owner", "username contact");
        res.status(200).json(requestedPGs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching requested PGs", error: err.message });
    }
};

// GET: PGs user has successfully booked (approved)
const getBookedPG = async (req, res) => {
    try {
        const bookedPG = await PG.findOne({
            bookedBy: req.user._id,
            status: "approved"
        }).populate("owner", "username contact");

        if (!bookedPG) {
            return res.status(404).json({ message: "No booked PG found." });
        }

        res.status(200).json(bookedPG);
    } catch (err) {
        res.status(500).json({ message: "Error fetching booked PG", error: err.message });
    }
};


// GET: Wishlist PGs
const getWishlistPGs = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.status(200).json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: "Error fetching wishlist PGs", error: err.message });
    }
};

// POST: Add PG to Wishlist
const addToWishlist = async (req, res) => {
    const { pgId } = req.params;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.wishlist.includes(pgId)) {
            return res.status(400).json({ message: "PG already in wishlist." });
        }

        user.wishlist.push(pgId);
        await user.save();

        res.status(200).json({ message: "PG added to wishlist." });
    } catch (err) {
        res.status(500).json({ message: "Error adding to wishlist", error: err.message });
    }
};

// DELETE: Remove PG from Wishlist
const removeFromWishlist = async (req, res) => {
    const { pgId } = req.params;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.wishlist = user.wishlist.filter(item => item.toString() !== pgId);
        await user.save();

        res.status(200).json({ message: "PG removed from wishlist." });
    } catch (err) {
        res.status(500).json({ message: "Error removing from wishlist", error: err.message });
    }
};

module.exports = {
    getUserProfile,
    getRequestedPGs,
    getBookedPG,
    getWishlistPGs,
    addToWishlist,
    removeFromWishlist
};