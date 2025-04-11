const PG = require("../models/pg-model");
const User = require("../models/user-model");
const multer = require("multer");
const path = require("path");

// ======================
// Multer Configuration
// ======================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads"); // make sure the 'uploads' folder exists
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (![".jpg", ".jpeg", ".png"].includes(ext)) {
            return cb(new Error("Only JPG, JPEG, and PNG images are allowed"), false);
        }
        cb(null, true);
    },
});

// ✅ Define middleware after `upload`
const uploadPGImage = upload.single("image");

// ======================
// Owner uploads a PG
// ======================

const addPG = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can add PGs" });
        }

        const { name, location, price, description, amenities, contact } = req.body;

        // if (!req.file) {
        //     return res.status(400).json({ message: "Image file is required" });
        // }

        const newPG = new PG({
            name,
            location,
            price,
            description,
            amenities: JSON.parse(amenities),
            images: [req?.file?.filename],
            owner: req.user._id,
            contact,
        });

        await newPG.save();
        res.status(201).json({ message: "PG uploaded successfully, pending admin approval." });

    } catch (error) {
        console.error("Error uploading PG:", error);
        res.status(500).json({ message: "Error uploading PG", error });
    }
};

// ======================
// Fetch approved PGs
// ======================

const getApprovedPGs = async (req, res) => {
    try {
        const pgList = await PG.find({ status: "approved" });
        res.status(200).json(pgList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching PGs", error });
    }
};

// ======================
// Owner fetches their PGs
// ======================

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

// ======================
// Admin approves PG
// ======================

const approvePG = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Only admins can approve PGs" });
        }

        const { pgId } = req.params;
        const pg = await PG.findById(pgId);

        if (!pg) return res.status(404).json({ message: "PG not found" });

        pg.status = "approved";
        await pg.save();

        res.status(200).json({ message: "PG approved successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error approving PG", error });
    }
};

// ======================
// Owner deletes PG
// ======================

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

// ======================
// User requests to book PG
// ======================

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

        if (pg.requests.includes(req.user._id)) {
            return res.status(400).json({ message: "You already requested this PG" });
        }

        pg.requests.push(req.user._id);
        await pg.save();

        res.status(200).json({ message: "PG booking request sent successfully" });

    } catch (error) {
        console.error("Error requesting PG:", error);
        res.status(500).json({ message: "Error requesting PG", error });
    }
};

// ======================
// Owner updates PG
// ======================

const updatePG = async (req, res) => {
    const ownerId = req.user._id;
    const { pgId } = req.params;
    const updateData = req.body;

    try {
        const existingPG = await PG.findById(pgId);

        if (!existingPG) {
            return res.status(404).json({ message: "PG not found" });
        }

        if (existingPG.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ message: "Unauthorized: Not your PG" });
        }

        // Remove fields that shouldn't be updated directly
        delete updateData.approved;

        // Handle amenities from comma-separated string to array (if sent as string)
        if (typeof updateData.amenities === "string") {
            updateData.amenities = updateData.amenities.split(",").map(item => item.trim());
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.filename);

            // Optional: Merge with existing images
            updateData.images = [...(existingPG.images || []), ...newImages];

            // If you want to REPLACE images instead of merging, use:
            // updateData.images = newImages;
        } else {
            // If no new files uploaded, retain existing images
            updateData.images = existingPG.images;
        }

        const updatedPG = await PG.findByIdAndUpdate(pgId, updateData, { new: true });

        res.status(200).json({
            message: "PG updated successfully",
            pg: updatedPG,
        });
    } catch (error) {
        console.error("Error updating PG:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ======================
// Owner fetches their approved PGs
// ======================

const getOwnerApprovedPGs = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can view their approved PGs" });
        }

        const approvedPGs = await PG.find({
            owner: req.user._id,
            status: "approved",
        });

        res.status(200).json(approvedPGs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching approved PGs", error });
    }
};

const getPGById = async (req, res) => {
    try {
        const pg = await PG.findById(req.params.id);
        if (!pg) {
            return res.status(404).json({ message: "PG not found" });
        }
        res.status(200).json(pg);
    } catch (err) {
        console.error("Error fetching PG by ID:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET approved PGs that are not booked
const getAvailableApprovedPGs = async (req, res) => {
    try {
        const pgs = await PG.find({
            status: "approved",        // Approved PGs only
            bookedBy: null            // Not yet booked
        }).populate("owner", "name email phone");

        res.status(200).json(pgs);
    } catch (error) {
        console.error("Error fetching available PGs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// – Owner sees user requests on their PGs
const getRequestedPGsForOwner = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can view requests" });
        }

        const pgs = await PG.find({
            owner: req.user._id,
            requests: { $exists: true, $not: { $size: 0 } }
        }).populate("requests", "name email phone"); // adjust user fields as needed

        res.status(200).json(pgs);
    } catch (error) {
        console.error("Error fetching requested PGs:", error);
        res.status(500).json({ message: "Error fetching requested PGs", error });
    }
};
//Owner approves a specific user request

const approvePGRequest = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can approve PG requests" });
        }

        const { pgId, userId } = req.params;
        const pg = await PG.findById(pgId);

        if (!pg) return res.status(404).json({ message: "PG not found" });
        if (pg.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only approve your own PGs" });
        }

        if (pg.bookedBy) {
            return res.status(400).json({ message: "PG already booked" });
        }

        if (!pg.requests.includes(userId)) {
            return res.status(400).json({ message: "User has not requested this PG" });
        }

        pg.bookedBy = userId;
        pg.requests = []; // clear requests
        await pg.save();

        res.status(200).json({ message: "PG request approved successfully" });

    } catch (error) {
        console.error("Error approving PG request:", error);
        res.status(500).json({ message: "Error approving PG request", error });
    }
};
const getOnlyRequestedPGs = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can view their PGs" });
        }

        const requestedPGs = await PG.find({
            owner: req.user._id,
            requests: { $exists: true, $not: { $size: 0 } } // filters only PGs with non-empty requests
        })
        .populate('requests', 'username email phone')
        .populate('bookedBy', 'username email phone');

        res.status(200).json(requestedPGs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching requested PGs", error });
    }
};



// ======================
// Export All Controllers
// ======================

module.exports = {
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
    getRequestedPGsForOwner,
    approvePGRequest,
    getOnlyRequestedPGs
};
