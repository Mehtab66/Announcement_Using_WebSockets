const User = require("../Models/User.Model");
const bcryt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../Utilities/generateToken");

//register User
module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, number } = req.body;
    let user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }
    user = new User({
      name,
      email,
      password,
      number,
    });
    const salt = await bcryt.genSalt(10);
    user.password = await bcryt.hash(password, salt);
    await user.save();
    res.status(200).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

//login user
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
    const isMatch = await bcryt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user);
    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
