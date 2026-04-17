const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/save", (req, res) => {
    const { winner } = req.body;

    const sql = "INSERT INTO games (winner) VALUES (?)";

    db.query(sql, [winner], (err, result) => {
        if (err) throw err;
        res.json({ message: "Game saved!" });
    });
});

module.exports = router;