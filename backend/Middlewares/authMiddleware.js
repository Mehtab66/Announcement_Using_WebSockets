const jwt = require("jsonwebtoken");

const VerifyActor = (req, res, next) => {
  const token = req.header("authorization");
  console.log("Token:", token);

  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    if (decoded.role === "Admin") {
      req.admin = { id: decoded.id, role: decoded.role }; // Assign decoded data to req.admin
      console.log("Admin:", req.admin);
    } else if (decoded.role === "User") {
      req.user = { id: decoded.id, role: decoded.role }; // Assign decoded data to req.user
      console.log("User:", req.user);
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(500).json({ message: "Invalid Token" });
  }
};

module.exports = { VerifyActor };
