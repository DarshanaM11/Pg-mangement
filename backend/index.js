require('dotenv').config(); // Load environment variables at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/auth");


// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",  // Allow frontend requests
    credentials: true
}));

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@pg.ut5xl.mongodb.net/?appName=PG`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Database and collections
let usersCollection, pgsCollection;

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB successfully!");

        const database = client.db("PG-Managment");

        // Creating collections if they don't exist
        usersCollection = database.collection("users");
        pgsCollection = database.collection("pgs");

        // Check and insert default users if not present
        const existingUsers = await usersCollection.countDocuments();
        if (existingUsers === 0) {
            await usersCollection.insertMany([
                { username: "admin123", password: "adminpass", role: "Admin" },
                { username: "owner123", password: "ownerpass", role: "PG Owner" },
                { username: "user123", password: "userpass", role: "User" }
            ]);
            console.log("Default users inserted.");
        }

        // API Route: Get all users
        app.get("/users", async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
        });

        // API Route: Login
        app.post("/api/login", async (req, res) => {
            try {
                const { username, password, role } = req.body;

                // Ensure connection before querying
                if (!global.usersCollection) {
                    return res.status(500).json({ success: false, message: "Database not connected" });
                }

                const user = await global.usersCollection.findOne({ username, password, role });

                if (user) {
                    res.send({ success: true, message: "Login successful", user });
                } else {
                    res.status(401).send({ success: false, message: "Invalid credentials" });
                }
            } catch (error) {
                console.error("Login Error:", error);
                res.status(500).send({ success: false, message: "Server error", error: error.message });
            }
        });

        // API Route: Add new PG
        app.post("/new-Pg", async (req, res) => {
            const newPg = req.body;
            const result = await pgsCollection.insertOne(newPg);
            res.send(result);
        });

        console.log("MongoDB setup complete.");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
    }
}
run();

// Start the Express server
app.get('/', (req, res) => {
    res.send('PG Management System API Running');
});


app.use("/api", authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World! D')
})

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
