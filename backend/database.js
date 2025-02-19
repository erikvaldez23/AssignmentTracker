const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// Create table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      course TEXT NOT NULL,
      due_date TEXT NOT NULL,
      type TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0
  )`,
  (err) => {
    if (err) {
      console.error("❌ Error creating table:", err.message);
    } else {
      console.log("✅ Assignments table ready.");
    }
  }
);

// Export database connection
module.exports = db;
