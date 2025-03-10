const Admin = require("../Models/admin.Model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../Utilities/generateToken");
module.exports.Login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const admin = await Admin.findOne({
      name,
    });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(admin);
    res
      .status(200)
      .json({ token, admin, message: "Admin loggedin successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
