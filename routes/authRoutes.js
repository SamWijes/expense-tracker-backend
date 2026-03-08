const express = require("express");
const { register, login } = require("../controller/authController");
const { singleUploadMW } = require("../controller/uploadController");
const multer = require('multer');
const upload=multer()
const router = express.Router();

router.post("/register", register);
router.post("/login",singleUploadMW, login);

module.exports = router;
