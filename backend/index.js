require('dotenv').config(); // Load environment variables at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@pg.ut5xl.mongodb.net/?appName=PG`;

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_CLUSTER) {
    console.error("MongoDB Connection Failed: Missing environment variables!");
    process.exit(1);
}

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully!");
}).catch(err => {
    console.error("MongoDB Connection Failed", err);
});
app.get('/', (req, res) => {
    res.send('Hello World! D')
})  

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
