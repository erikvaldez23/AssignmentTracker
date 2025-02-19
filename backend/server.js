const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database"); // Import database module

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Get all pending assignments
app.get("/assignments", (req, res) => {
  db.all("SELECT * FROM assignments WHERE completed = 0", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ assignments: rows });
  });
});

// Get completed assignments
app.get("/completed-assignments", (req, res) => {
  db.all("SELECT * FROM assignments WHERE completed = 1", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ completed_assignments: rows });
  });
});

// Mark an assignment as completed
app.put("/complete-assignment/:id", (req, res) => {
  const assignmentId = req.params.id;
  db.run("UPDATE assignments SET completed = 1 WHERE id = ?", [assignmentId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "✅ Assignment marked as completed", changes: this.changes });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
