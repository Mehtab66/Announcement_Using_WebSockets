const jwt = require("jsonwebtoken");
module.exports.generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
};
