const express = require("express");
const multer = require("multer");
const router = express.Router();
const auth = require("../middleware/auth");
const { uploadFile } = require("../controllers/fileController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", auth, upload.single("file"), uploadFile);

module.exports = router;
