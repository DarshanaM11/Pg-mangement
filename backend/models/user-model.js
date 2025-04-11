const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure unique email
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "owner", "admin"],  // Added "admin"
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "PG" }] // Stores PG IDs

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Generate JWT Token
userSchema.methods.generateToken = function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                role: this.role, // Added role
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" } // Updated expiry
        );
    } catch (error) {
        console.error(error);
    }
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
