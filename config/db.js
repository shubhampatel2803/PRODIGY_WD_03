const mysql = require("mysql2");

let db;

try {
    db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "tic_tac_toe"
    });

    db.connect((err) => {
        if (err) {
            console.log("⚠️ DB not connected (running without DB)");
        } else {
            console.log("✅ DB Connected");
        }
    });

} catch (error) {
    console.log("⚠️ DB error:", error.message);
}

module.exports = db;