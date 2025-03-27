const mongoose = require("mongoose");
require('dotenv').config();

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@pg.ut5xl.mongodb.net/PG-Managment?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@pg.ut5xl.mongodb.net/?retryWrites=true&w=majority&appName=PG-Managment`;

const connectDB = async () => {
    try {
        
        mongoose.connect(uri);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
