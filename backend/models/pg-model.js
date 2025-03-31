const mongoose = require("mongoose");

const pgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amenities: {
        type: [String], // Array of amenities
        required: true,
    },
    images: {
        type: [String], // Store image URLs
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false, // Admin approval required
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Only one user can book a PG
        default: null,
    },
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store user IDs who requested booking

}, { timestamps: true });

const PG = mongoose.model("PG", pgSchema);

module.exports = PG;
