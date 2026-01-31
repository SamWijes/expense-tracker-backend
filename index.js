require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const uploadRoutes=require('./routes/uploadRoutes');
const { upload_dir } = require("./controller/uploadController");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "OK", service: "Expense Tracker API" })
);

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api",uploadRoutes)


const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
