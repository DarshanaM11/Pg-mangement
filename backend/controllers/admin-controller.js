const User = require("../models/user-model");
const PG = require("../models/pg-model");

// Get all users
const getUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
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
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can view owners" });
        }

        const owners = await User.find({ role: "owner" }).select("-password");
        res.status(200).json(owners);
        console.log("Admin routes loaded ✅");

    } catch (error) {
        res.status(500).json({ message: "Error fetching owners", error });
    }
};
const generateReports = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can generate reports" });
        }

        const totalPGs = await PG.countDocuments();
        const bookedPGs = await PG.countDocuments({ bookedBy: { $ne: null } });

        const approvedPGs = await PG.countDocuments({ status: "approved" });
        const pendingPGs = await PG.countDocuments({ status: "pending" });
        const rejectedPGs = await PG.countDocuments({ status: "rejected" });

        const ownerCount = await User.countDocuments({ role: "owner" });
        const userCount = await User.countDocuments({ role: "user" });


        const report = {
            totalPGs,
            bookedPGs,
            approvedPGs,
            pendingPGs,
            rejectedPGs,
            ownerCount,
            userCount
        };


        res.status(200).json(report);

    } catch (error) {
        console.error("❌ Error generating admin report:", error);
        res.status(500).json({ message: "Error generating reports", error });
    }
};


// Delete a user
const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can delete users" });
        }

        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user || user.role !== 'user') {
            return res.status(404).json({ message: "User not found or invalid role" });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

// Delete an owner
const deleteOwner = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can delete owners" });
        }

        const ownerId = req.params.id;
        const owner = await User.findById(ownerId);

        if (!owner || owner.role !== 'owner') {
            return res.status(404).json({ message: "Owner not found or invalid role" });
        }

        // Optional: Delete PGs uploaded by owner if needed
        await PG.deleteMany({ ownerId });

        await User.findByIdAndDelete(ownerId);
        res.status(200).json({ message: "Owner and their PGs deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting owner", error });
    }
};


// // Get all pending PGs
// const getPendingPGs = async (req, res) => {
//     try {
//         if (req.user.role !== "admin") {
//             return res.status(403).json({ message: "Only admins can view pending PGs" });
//         }

//         const pendingPGs = await PG.find({ status: "pending" }).populate({
//             path: "owner", // ✅ changed from ownerId to owner
//             select: "username email",
//         });

//         // Add ownerName safely
//         const result = pendingPGs.map(pg => ({
//             ...pg._doc,
//             ownerName: pg.owner?.username || "Unknown",
//         }));

//         res.status(200).json(result);

//     } catch (error) {
//         console.error("❌ Error fetching pending PGs:", error);
//         res.status(500).json({ message: "Error fetching pending PGs", error });
//     }
// };

// Approve or reject PG
const updatePGStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can update PG status" });
        }

        const { id, action } = req.params;
        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        const updatedPG = await PG.findByIdAndUpdate(
            id,
            { status: action === "approve" ? "approved" : "rejected" },
            { new: true }
        );

        if (!updatedPG) {
            return res.status(404).json({ message: "PG not found" });
        }

        res.status(200).json({ message: `PG ${action}d successfully`, pg: updatedPG });
    } catch (error) {
        console.error("❌ Error updating PG status:", error);
        res.status(500).json({ message: "Error updating PG status", error });
    }
};
// GET PGs by status (approved, rejected, pending)
const getPGsByStatus = async (req, res) => {
    const { status } = req.params;

    // Validate status
    const validStatuses = ["approved", "pending", "rejected"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid PG status" });
    }

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can view pending PGs" });
        }
        const pgs = await PG.find({ status }).populate("owner", "username email phone");

        res.status(200).json(pgs);
    } catch (err) {
        console.error("Error fetching PGs by status:", err);
        res.status(500).json({ error: "Server error" });
    }
};
module.exports = {
    getUsers,
    getOwners,
    generateReports,
    deleteUser,
    deleteOwner,
    // getPendingPGs,
    updatePGStatus,
    getPGsByStatus
};