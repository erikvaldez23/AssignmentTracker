const db = require("./database"); // Import database module
const xlsx = require("xlsx");

// Load Excel file
const workbook = xlsx.readFile("Academic Calendar.xlsx");
const sheet_name = workbook.SheetNames[0]; // Get the first sheet
const sheet = workbook.Sheets[sheet_name];

// Convert Excel data to JSON
const data = xlsx.utils.sheet_to_json(sheet);

if (data.length === 0) {
  console.log("❌ No data found in the Excel file.");
  process.exit(1);
}

// Insert data into the assignments table
const insertAssignment = db.prepare(
  `INSERT INTO assignments (name, course, due_date, type, completed) VALUES (?, ?, ?, ?, ?)`
);

data.forEach((row) => {
  try {
    const course = row["Class"] ? row["Class"].toString().trim() : "Unknown Course";
    const assignment = row["Assignment"] ? row["Assignment"].toString().trim() : "Untitled Assignment";

    // Convert due date to a string, handling both numbers and undefined values
    let dueDate = row["Due Date"];
    if (dueDate) {
      if (typeof dueDate === "number") {
        dueDate = new Date((dueDate - 25569) * 86400 * 1000).toISOString().split("T")[0]; // Convert Excel serial number to YYYY-MM-DD
      } else {
        dueDate = dueDate.toString().trim();
      }
    } else {
      dueDate = "N/A"; // Default value for missing dates
    }

    const completed = row["Complete"] ? 1 : 0;

    insertAssignment.run(assignment, course, dueDate, "General", completed);
  } catch (err) {
    console.error("❌ Error inserting row:", err.message);
  }
});

insertAssignment.finalize(); // Close statement
console.log("✅ Data imported successfully.");
db.close();
