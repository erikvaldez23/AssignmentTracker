import sqlite3
import pandas as pd

# Load Excel file
df = pd.read_excel("assignments.xlsx")

# Connect to database
conn = sqlite3.connect("database.db")
cursor = conn.cursor()

# Create table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        course TEXT NOT NULL,
        due_date TEXT NOT NULL,
        type TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0
    )
""")

# Insert data
for _, row in df.iterrows():
    cursor.execute("INSERT INTO assignments (name, course, due_date, type) VALUES (?, ?, ?, ?)", 
                   (row["name"], row["course"], row["due_date"], row["type"]))

conn.commit()
conn.close()
