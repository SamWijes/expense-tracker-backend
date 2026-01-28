const pool = require("../db/db");

function addExpense(req, res) {
  const userId = req.user.id;
  const { title, amount, expense_date } = req.body;

  if (!title || typeof amount !== "number" || !expense_date) {
    return res.status(400).json({
      message: "title, amount(number), expense_date required"
    });
  }

  pool.query(
    `INSERT INTO expenses (user_id, title, amount, expense_date)
     VALUES (?, ?, ?, ?)`,
    [userId, title.trim(), amount, expense_date],
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
    SELECT id, title, amount, expense_date, created_at
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

  // DESC order for expense cards
  sql += " ORDER BY expense_date DESC, id DESC";

  pool.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ expenses: rows });
  });
}

module.exports = { addExpense, getExpenses };
