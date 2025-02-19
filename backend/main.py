from fastapi import FastAPI
import sqlite3

app = FastAPI()

# Get all assignments
@app.get("/assignments")
def get_assignments():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assignments WHERE completed = 0")
    assignments = cursor.fetchall()
    conn.close()
    return {"assignments": assignments}

# Get completed assignments
@app.get("/completed-assignments")
def get_completed_assignments():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assignments WHERE completed = 1")
    assignments = cursor.fetchall()
    conn.close()
    return {"completed_assignments": assignments}

# Mark an assignment as completed
@app.put("/complete-assignment/{assignment_id}")
def complete_assignment(assignment_id: int):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE assignments SET completed = 1 WHERE id = ?", (assignment_id,))
    conn.commit()
    conn.close()
    return {"message": "Assignment marked as completed"}
