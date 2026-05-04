const jwt = require("jsonwebtoken"); 

function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // payload

    req.user = {
      _id: decoded.id,
      role: decoded.role,
      club: decoded.club 
    };

    next(); 
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
}

module.exports = { checkAuth };
