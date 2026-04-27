const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET = "crm_secret_key";

let users = [
  {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync("admin123", 8),
    role: "admin",
  },
  {
    id: 2,
    username: "sales",
    password: bcrypt.hashSync("sales123", 8),
    role: "sales",
  },
];

let leads = [];

// Middleware
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token.split(" ")[1], SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
}

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(404).json({ message: "User not found" });

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword)
    return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user.id, role: user.role, username: user.username },
    SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role, username: user.username });
});

// Get all leads
app.get("/leads", verifyToken, (req, res) => {
  if (req.user.role === "admin") {
    return res.json(leads);
  }

  const salesLeads = leads.filter((lead) => lead.owner === req.user.username);
  res.json(salesLeads);
});

// Add lead
app.post("/leads", verifyToken, (req, res) => {
  const newLead = {
    ...req.body,
    stage: req.body.stage || "New",
    owner: req.user.username,
    activityLog: [],
  };

  leads.push(newLead);
  res.json(newLead);
});

// Update lead
app.put("/leads/:index", verifyToken, (req, res) => {
  const index = req.params.index;
  leads[index] = { ...leads[index], ...req.body };
  res.json(leads[index]);
});

});