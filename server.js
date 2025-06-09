const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "frontend")));

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "palm_oil_data";

// API endpoint
app.get("/data-sources", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("data_sources");
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Serve index.html on root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
