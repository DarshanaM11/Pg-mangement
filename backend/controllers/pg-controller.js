const PG = require("../models/pg-model");
const User = require("../models/user-model");

// Owner uploads a PG
const addPG = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can add PGs" });
        }

        const { name, location, price, description, amenities, images, contact } = req.body;

        const newPG = new PG({
            name,
            location,
            price,
            description,
            amenities,
            images,
            owner: req.user._id,
            contact,
        });

        await newPG.save();
        res.status(201).json({ message: "PG uploaded successfully, pending admin approval." });

    } catch (error) {
        res.status(500).json({ message: "Error uploading PG", error });
    }
};

// Fetch approved PGs (For users)
const getApprovedPGs = async (req, res) => {
    try {
        const pgList = await PG.find({ approved: true });
        res.status(200).json(pgList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching PGs", error });
    }
};

// Owner fetches their PG listings
const getOwnerPGs = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can view their PGs" });
        }

        const ownerPGs = await PG.find({ owner: req.user._id });
        res.status(200).json(ownerPGs);

    } catch (error) {
        res.status(500).json({ message: "Error fetching owner's PGs", error });
    }
};

// Admin approves PG
const approvePG = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Only admins can approve PGs" });
        }

        const { pgId } = req.params;
        const pg = await PG.findById(pgId);

        if (!pg) return res.status(404).json({ message: "PG not found" });

        pg.approved = true;
        await pg.save();

        res.status(200).json({ message: "PG approved successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error approving PG", error });
    }
};

// Owner deletes PG
const deletePG = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can delete PGs" });
        }

        const { pgId } = req.params;
        const pg = await PG.findById(pgId);

        if (!pg) return res.status(404).json({ message: "PG not found" });

        if (pg.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own PGs" });
        }

        await PG.findByIdAndDelete(pgId);
        res.status(200).json({ message: "PG deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting PG", error });
    }
};

// User requests to book PG
const requestPG = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only users can request PGs" });
        }

        const { pgId } = req.params;
        const pg = await PG.findById(pgId);

        if (!pg) return res.status(404).json({ message: "PG not found" });

        if (pg.bookedBy) {
            return res.status(400).json({ message: "This PG is already booked" });
        }

        pg.bookedBy = req.user._id;
        await pg.save();

        res.status(200).json({ message: "PG booking request sent successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error requesting PG", error });
    }
};

module.exports = { addPG, getApprovedPGs, getOwnerPGs, approvePG, deletePG, requestPG };
