const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Temporary storage
let leads = [];

// Get all leads
app.get("/leads", (req, res) => {
  res.json(leads);
});

// Add new lead
app.post("/leads", (req, res) => {
  leads.push(req.body);
  res.json(req.body);
});

// Delete lead
app.delete("/leads/:index", (req, res) => {
  const index = req.params.index;
  leads.splice(index, 1);
  res.json({ message: "Deleted" });
});

// Start server
app.listen(5000, () => console.log("Server running on 5000"));