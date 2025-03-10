const jwt = require("jsonwebtoken");
module.exports.generateToken = (user, Role) => {
  return jwt.sign({ id: user.id, role: Role }, process.env.JWT_SECRET);
};
