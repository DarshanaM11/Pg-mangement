const mongoose = require('mongoose');

const PgSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    location: {
        street: String,
        city: String,
        state: String,
        country: String,
        coordinates: { lat: Number, long: Number }
    },
    roomsAvailable: Number,
    amenities: [String],
    rent: Number,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Pg", PgSchema);
