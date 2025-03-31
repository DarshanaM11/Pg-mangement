const express = require("express");
const { addPG, getApprovedPGs, getOwnerPGs, approvePG, deletePG, requestPG } = require("../controllers/pg-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

// Owner uploads a PG
router.post("/add", authMiddleware, addPG);

// Fetch all approved PGs (For users)
router.get("/listings", getApprovedPGs);

// Owner fetches their own PG listings
router.get("/owner-listings", authMiddleware, getOwnerPGs);

// Admin approves/rejects PG
router.put("/approve/:pgId", authMiddleware, approvePG);

// Owner deletes a PG (approved or not)
router.delete("/delete/:pgId", authMiddleware, deletePG);

// User requests to book a PG
router.post("/request/:pgId", authMiddleware, requestPG);

module.exports = router;
