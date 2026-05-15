const express = require("express");
const logoUpload = require("../middleware/logoUpload");
const { uploadLogo } = require("../controllers/uploadController");

const router = express.Router();

router.post("/logo", logoUpload.single("logo"), uploadLogo);

module.exports = router;
