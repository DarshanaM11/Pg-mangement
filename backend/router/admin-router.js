const express = require("express");
const { 
    getUsers, 
    getOwners, 
    generateReports, 
    deleteUser, 
    deleteOwner,
    // getPendingPGs,
    updatePGStatus,
    getPGsByStatus
} = require("../controllers/admin-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.get("/users", authMiddleware, getUsers);
router.get("/owners", authMiddleware, getOwners);
router.get("/reports", authMiddleware, generateReports);

// 🔴 Delete Routes
router.delete("/users/:id", authMiddleware, deleteUser);
router.delete("/owners/:id", authMiddleware, deleteOwner);

router.get("/pgs/:status", authMiddleware, getPGsByStatus);


// Pending PG-related routes
// router.get("/pgs/pending", authMiddleware, getPendingPGs);
router.put("/pgs/:id/:action", authMiddleware, updatePGStatus);

module.exports = router;
