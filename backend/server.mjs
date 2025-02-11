import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Web3 from "web3";

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

