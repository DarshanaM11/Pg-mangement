const User = require("../models/user-model");
const PG = require("../models/pg-model");

// Get all users
const getUsers = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Only admins can view users" });
        }

        const users = await User.find({ role: "user" }).select("-password");
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

// Get all owners
const getOwners = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Only admins can view owners" });
        }

        const owners = await User.find({ role: "owner" }).select("-password");
        res.status(200).json(owners);

    } catch (error) {
        res.status(500).json({ message: "Error fetching owners", error });
    }
};

// Generate reports (e.g., total PGs, booked PGs, etc.)
const generateReports = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Only admins can generate reports" });
        }

        const totalPGs = await PG.countDocuments();
        const bookedPGs = await PG.countDocuments({ bookedBy: { $ne: null } });

        res.status(200).json({ totalPGs, bookedPGs });

    } catch (error) {
        res.status(500).json({ message: "Error generating reports", error });
    }
};

module.exports = { getUsers, getOwners, generateReports };
