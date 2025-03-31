const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');  // Import the DB connection function
const router = require('./router/auth-router');
const pgRoutes =require('./router/pg-router')
const errorMiddleware = require('./middlewares/error-middleware');

dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5001;
app.use("/", router);
app.use("/api/pg", pgRoutes);  // ✅ This means all PG routes start with /api/pg
app.use(errorMiddleware)


// Connect to MongoDB and Start Server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server is running on port ${port}`);
    });
}).catch(err => {
    console.error("❌ Failed to connect to MongoDB", err);
});
