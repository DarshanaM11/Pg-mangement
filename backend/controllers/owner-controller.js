const PG = require("../models/pg-model");
const User = require("../models/user-model");

// View all requests for a PG
const viewRequests = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can view requests" });
        }

        const { pgId } = req.params;
        const pg = await PG.findById(pgId).populate("requests");

        if (!pg || pg.owner.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "PG not found or not owned by you" });
        }

        res.status(200).json(pg.requests);

    } catch (error) {
        res.status(500).json({ message: "Error fetching requests", error });
    }
};

// Approve a user for a PG booking
const approveBooking = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can approve bookings" });
        }

        const { pgId, userId } = req.params;
        const pg = await PG.findById(pgId);

        if (!pg || pg.owner.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "PG not found or not owned by you" });
        }

        if (pg.bookedBy) {
            return res.status(400).json({ message: "PG already booked by another user" });
        }

        pg.bookedBy = userId;
        // pg.requests = []; // Clear all other requests
        await pg.save();

        res.status(200).json({ message: "PG booking approved successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error approving booking", error });
    }
};


const getOwnerProfile = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const owner = await User.findById(ownerId).select("-password");

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        res.status(200).json(owner);
    } catch (error) {
        console.error("Error fetching owner profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { viewRequests, approveBooking, getOwnerProfile };
