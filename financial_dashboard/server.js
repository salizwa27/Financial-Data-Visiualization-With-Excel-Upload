const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const xlsx = require("xlsx");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       
  password: "Khayalethumayekiso@03",       
  database: "finances_app"
});

// Multer setup for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Endpoint
app.post("/api/finances/upload/:userId/:year", upload.single("file"), async (req, res) => {
  const { userId, year } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Parse Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet); // [{Month: 'January', Amount: 100}, ...]

    // Get the next upload_id for this user/year
    const [result] = await db.promise().query(
      "SELECT MAX(upload_id) as last FROM Financial_records WHERE user_id = ? AND year = ?",
      [userId, year]
    );
    const newUploadId = (result[0].last || 0) + 1;

    // Insert new rows with upload_id
    for (let row of data) {
      await db.promise().query(
        "INSERT INTO Financial_records (user_id, year, month, amount, upload_id) VALUES (?, ?, ?, ?, ?)",
        [userId, year, row.Month, row.Amount, newUploadId]
      );
    }

    res.json({ message: "File uploaded successfully", upload_id: newUploadId });
  } catch (err) {
    console.error("Error processing upload:", err);
    res.status(500).json({ error: "Failed to process file" });
  }
});

// Fetch Latest Upload Only
app.get("/api/finances/:userId/:year", async (req, res) => {
  const { userId, year } = req.params;

  try {
    // Get latest upload_id for this user/year
    const [latest] = await db.promise().query(
      "SELECT MAX(upload_id) as latestUpload FROM Financial_records WHERE user_id = ? AND year = ?",
      [userId, year]
    );

    if (!latest[0].latestUpload) {
      return res.json({ user: "Unknown", year, records: [] });
    }

    // Fetch only the latest upload
const [rows] = await db.promise().query(
  "SELECT month, amount FROM Financial_records WHERE user_id = ? AND year = ? AND upload_id = ?",
  [userId, year, latest[0].latestUpload]
);

    // Optionally fetch user name
    const [user] = await db.promise().query(
      "SELECT name FROM Users WHERE user_id = ?",
      [userId]
    );

    res.json({ user: user[0]?.name || "Unknown", year, records: rows });
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${5000}`);
});

