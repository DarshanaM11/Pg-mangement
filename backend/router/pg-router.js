const express = require("express");
const {
    uploadPGImage,
    addPG,
    getApprovedPGs,
    getOwnerPGs,
    approvePG,
    deletePG,
    requestPG,
    updatePG,
    getOwnerApprovedPGs,
    getPGById,
    getAvailableApprovedPGs,
} = require("../controllers/pg-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const upload = require("../middlewares/multer");


const router = express.Router();

// Owner uploads a PG with image
router.post("/add", authMiddleware, uploadPGImage, addPG);

// Fetch all approved PGs (for users)
router.get("/listings", getApprovedPGs);

// Owner fetches their own PG listings
router.get("/owner-listings", authMiddleware, getOwnerPGs);

// Admin approves or rejects a PG
router.put("/approve/:pgId", authMiddleware, approvePG);

// Owner deletes a PG
router.delete("/delete/:pgId", authMiddleware, deletePG);

// User requests to book a PG
router.post("/request/:pgId", authMiddleware, requestPG);

// Owner updates PG details
router.put("/update/:pgId", authMiddleware, upload.array("images"), updatePG);

// Owner fetches their approved PGs
router.get('/owner/approved', authMiddleware, getOwnerApprovedPGs);
router.get("/available-approved", authMiddleware, getAvailableApprovedPGs);


router.get("/:id", authMiddleware, getPGById);

//available approved pgs


module.exports = router;
