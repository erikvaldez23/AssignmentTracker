import pandas as pd

def read_excel(file_path):
    df = pd.read_excel(file_path)  # Read the Excel file
    return df.to_dict(orient="records")  # Convert to JSON format

assignments = read_excel("Academic Calendar.xlsx")
print(assignments)  # Test output
