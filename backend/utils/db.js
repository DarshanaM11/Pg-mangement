const mongoose = require("mongoose");
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@pg.ut5xl.mongodb.net/PG-Managment?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        await mongoose.connect(uri); // Removed deprecated options
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
