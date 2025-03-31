const express = require("express");
const { getUsers, getOwners, generateReports } = require("../controllers/admin-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.get("/users", authMiddleware, getUsers);
router.get("/owners", authMiddleware, getOwners);
router.get("/reports", authMiddleware, generateReports);

module.exports = router;
