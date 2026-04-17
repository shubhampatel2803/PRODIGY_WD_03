const express = require("express");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", gameRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});