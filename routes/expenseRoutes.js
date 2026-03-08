const express = require("express");
const { addExpense, getExpenses } = require("../controller/expenseController");
const authMiddleware = require("../middleware/authMiddleware");
const { singleUploadMW } = require("../controller/uploadController");

const router = express.Router();

// Protected routes
router.post("/",authMiddleware,singleUploadMW, addExpense);
router.get("/", authMiddleware, getExpenses);

module.exports = router;
