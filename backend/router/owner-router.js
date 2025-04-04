const express = require("express");
const { viewRequests, approveBooking } = require("../controllers/owner-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.get("/requests/:pgId", authMiddleware, viewRequests);
router.put("/approve/:pgId/:userId", authMiddleware, approveBooking);

module.exports = router;
