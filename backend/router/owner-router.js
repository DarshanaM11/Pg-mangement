const express = require("express");
const { viewRequests, approveBooking, getOwnerProfile, rejectRequest } = require("../controllers/owner-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.get("/requests/:pgId", authMiddleware, viewRequests);
router.put("/approve/:pgId/:userId", authMiddleware, approveBooking);
router.get("/profile", authMiddleware, getOwnerProfile);
router.delete("/reject/:pgId/:userId", authMiddleware, rejectRequest);



module.exports = router;
