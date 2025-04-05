const pool = require("../models/db");
const path = require("path");

exports.uploadFile = async (req, res) => {
  const { taskId } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ msg: "No file uploaded" });

  try {
    const result = await pool.query(
      "INSERT INTO attachments (task_id, filename, file_path, file_type) VALUES ($1, $2, $3, $4) RETURNING *",
      [taskId, file.originalname, file.path, file.mimetype]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
