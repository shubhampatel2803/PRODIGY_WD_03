const express = require("express");
const router = express.Router();
const db = require("../config/db");

// SAVE GAME
router.post("/save", (req, res) => {
    if (!db) return res.json({ message: "DB disabled" });

    db.query(
        "INSERT INTO games (winner) VALUES (?)",
        [req.body.winner],
        (err) => {
            if (err) return res.json({ message: "DB error" });
            res.json({ message: "Saved" });
        }
    );
});

// GET HISTORY
router.get("/history", (req, res) => {
    if (!db) return res.json([]);

    db.query("SELECT * FROM games", (err, result) => {
        if (err) return res.json([]);
        res.json(result);
    });
});

module.exports = router;