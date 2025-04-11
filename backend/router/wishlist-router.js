const express = require("express");
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controllers/wishlist-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/add/:pgId", authMiddleware, addToWishlist); 
router.delete("/remove/:pgId", authMiddleware, removeFromWishlist); 
router.get("/", authMiddleware, getWishlist);

module.exports = router;
