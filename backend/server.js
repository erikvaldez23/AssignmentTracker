const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database"); // Import database module

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🆕 Add an assignment to the database
app.post("/assignments", (req, res) => {
  console.log("Incoming POST request:", req.body);

  const { course, name, type, dueDate } = req.body;

  if (!course || !name || !type || !dueDate) {
      return res.status(400).json({ error: "❌ All fields are required" });
  }

  const sql = `INSERT INTO assignments (course, name, type, due_date, completed) VALUES (?, ?, ?, ?, 0)`;
  db.run(sql, [course, name, type, dueDate], function (err) {
      if (err) {
          console.error("Database Error:", err.message); // ✅ Log the actual error
          return res.status(500).json({ error: err.message });
      }
      res.json({
          message: "✅ Assignment added successfully",
          assignment: { id: this.lastID, course, name, type, dueDate, completed: 0 },
      });
  });
});



// Get all pending assignments
// Get all pending assignments, sorted by due_date
app.get("/assignments", (req, res) => {
  db.all("SELECT * FROM assignments WHERE completed = 0 ORDER BY due_date ASC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ assignments: rows });
  });
});


// Get completed assignments
app.get("/completed-assignments", (req, res) => {
  db.all("SELECT * FROM assignments WHERE completed = 0 ORDER BY due_date ASC", [], (err, rows) => {
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
