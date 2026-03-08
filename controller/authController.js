const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");

const SALT_ROUNDS = 10;

function register(req, res) {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, password are required" });
  }

  pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (rows.length > 0) {
        return res.status(409).json({ message: "Email already registered" });
      }

      try {
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        pool.query(
          "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
          [name, email, password_hash],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
              message: "Registered successfully",
              user: {
                id: result.insertId,
                name,
                email
              }
            });
          }
        );
      } catch (hashErr) {
        res.status(500).json({ error: hashErr.message });
      }
    }
  );
}
/**@param {import('express').Request} req */
function login(req, res) {
  console.log("authcontrol",req.body);
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = ?",
    [email],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }
  );
}

module.exports = { register, login };
