const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const Web3 = require("web3");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Correct way to initialize Web3 in Web3.js v4
const web3 = new Web3("HTTP://127.0.0.1:7545");

app.get("/", (req, res) => {
    res.send("Blockchain Land Registry API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

console.log("Web3 is connected :-", web3);
