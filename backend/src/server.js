require("dotenv").config();

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");

const http = require("http");
const { connectToSocket } = require("./controllers/socketManager.js");

const server = http.createServer(app);

app.use(cors({
    origin: "*", // frontend url
    methods: ["GET", "POST"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = process.env.ATLASDB_URL;

mongoose.connect(url)
    .then(() => console.log("DB connected"))
    .catch((error) => console.log(error));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

connectToSocket(server);

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});