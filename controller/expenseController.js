
const pool = require("../db/db");
const path = require('path');



function addExpense(req, res) {
//   console.log("---- ADD EXPENSE DEBUG ----");
console.log("content-type:", req.headers["content-type"]);
// console.log("req.file:", req.file);
// console.log("req.body:", req.body);
// console.log("req.user:", req.user);
// console.log("---------------------------");
  const userId = req.user.id;
  // console.log(req.file);
  
  const { title, amount, expense_date } = req.body;
  const file=req.file;

  if (!title || typeof parseInt(amount) !== "number" || !expense_date) {
    return res.status(400).json({
      message: "title, amount(number), expense_date required"
    });
  }
  let sql=`INSERT INTO expenses (user_id, title, amount, expense_date)
     VALUES (?, ?, ?, ?)`;
  let qParam= [userId, title.trim(), amount, expense_date];
  if(file){
    sql=`INSERT INTO expenses (user_id, title, amount, expense_date,receipt)
     VALUES (?, ?, ?, ? ,?)`
    qParam.push(file.path)
  }

  pool.query(
    sql,
    qParam,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Expense added",
        expense: {
          id: result.insertId,
          title,
          amount,
          expense_date
        }
      });
    }
  );
}

function getExpenses(req, res) {
  const userId = req.user.id;
  const { start, end } = req.query;

  let sql = `
    SELECT id, title, amount, expense_date, created_at,receipt
    FROM expenses
    WHERE user_id = ?
  `;
  const params = [userId];

  if (start) {
    sql += " AND expense_date > ?";
    params.push(start);
  }

  if (end) {
    sql += " AND expense_date <= ?";
    params.push(end);
  }

  sql += " ORDER BY expense_date DESC, id DESC";

  pool.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ expenses: rows });
  });
}

module.exports = { addExpense, getExpenses };
