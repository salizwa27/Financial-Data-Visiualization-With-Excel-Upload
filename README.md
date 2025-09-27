# Financial Data Visualization App

This is a full-stack web application that allows users to upload Excel files containing monthly financial data.  
The system stores the data in a MySQL database and displays results on a dashboard with both a table and a bar chart.

---

## Features
- Upload Excel files (`.xlsx` / `.xls`) with financial records.
- Parse and save data to MySQL with unique upload tracking.
- Display latest uploaded records in a table.
- Visualize monthly amounts using a bar chart (Chart.js).
- Prevents invalid file uploads with clear error messages.

---

## Tech Stack
- **Frontend**: HTML, TailwindCSS, JavaScript (Chart.js)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **File Handling**: Multer, XLSX

---

## Project Structure

/public
├── index.html
├── script.js
/financial_dashboard
├── server.js
└── package.json


---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/salizwa27/financial-data-visualization.git
cd financial-data-visualization
---
