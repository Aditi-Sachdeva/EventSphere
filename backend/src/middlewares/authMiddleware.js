const jwt = require("jsonwebtoken"); // IMPORT JWT LIBRARY

function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization; // e.g. Authorization: Bearer ABC123XYZ

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // VERIFY USING SECRET KEY

    // Attach decoded payload to req.user
    req.user = {
      _id: decoded.id,
      role: decoded.role,
      club: decoded.club // ✅ include club from JWT
    };

    next(); // Next Middleware or Route Handler
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
}

module.exports = { checkAuth };
