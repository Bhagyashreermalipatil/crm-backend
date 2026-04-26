const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let leads = [];

// Get all leads
app.get("/leads", (req, res) => {
  res.json(leads);
});

// Add lead
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

// Edit lead
app.put("/leads/:index", (req, res) => {
  const index = req.params.index;
  leads[index] = req.body;
  res.json(leads[index]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});