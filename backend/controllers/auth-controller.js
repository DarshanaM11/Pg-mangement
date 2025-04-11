const User = require("../models/user-model");

// Home Logic
const home = async (req, res) => {
    try {
        res.status(200).send("This is the home page");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Register Logic
const register = async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;

        // Ensure role is valid
        const validRoles = ["user", "owner", "admin"]; // Added "admin"
        if (!validRoles.includes(role.toLowerCase())) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        // Check if email already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create user
        const userCreated = await User.create({ username, email, phone, password, role });

        res.status(201).json({
            msg: "Registration Successful!!",
            token: await userCreated.generateToken(),
            userId: userCreated._id.toString(),
            role: userCreated.role, // Include role in response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login Logic
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Compare Password
        const isMatch = await userExist.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // Generate Token and Respond
        res.status(200).json({
            msg: "Login Successful!!",
            token: await userExist.generateToken(),
            userId: userExist._id.toString(),
            role: userExist.role, // Include role in response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { home, register, login };
