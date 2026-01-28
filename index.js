require("dotenv").config();
const express = require("express");


const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();


app.use(express.json());

app.get("/", (req, res) => res.json({ status: "OK", service: "Expense Tracker API" }));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
