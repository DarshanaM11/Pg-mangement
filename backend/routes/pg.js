const express = require('express');
const Pg = require('../models/Pg');
const router = express.Router();

// Add PG
router.post('/add', async (req, res) => {
    try {
        const pg = new Pg(req.body);
        await pg.save();
        res.status(201).json(pg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch PGs (only approved)
router.get('/list', async (req, res) => {
    const pgs = await Pg.find({ status: "approved" });
    res.json(pgs);
});

module.exports = router;
