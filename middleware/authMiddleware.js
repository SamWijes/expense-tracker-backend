const jwt = require("jsonwebtoken");
/**@param {import('express').Request} req */
function authMiddleware(req, res, next) {
  try {
    // console.log("middlwWare",req.headers);
    
    const header = req.headers.authorization;
  
    
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
}

module.exports = authMiddleware;
