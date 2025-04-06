const express = require("express");
const {
    getUserProfile,
    getRequestedPGs,
    getBookedPG,
    getWishlistPGs,
    addToWishlist,
    removeFromWishlist
} = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// GET /user/profile
router.get("/profile", authMiddleware, getUserProfile);

// GET /user/requested-pgs
router.get("/requested-pgs", authMiddleware, getRequestedPGs);

// GET /user/booked-pg
router.get("/booked-pg", authMiddleware, getBookedPG);

// GET /user/wishlist
router.get("/wishlist", authMiddleware, getWishlistPGs);

router.post("/wishlist/:pgId", authMiddleware, addToWishlist);

router.delete("/wishlist/:pgId", authMiddleware, removeFromWishlist);

module.exports = router;
