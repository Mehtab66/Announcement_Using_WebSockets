const mongoose = require("mongoose");
const Admin = require("../Models/Admin.Model");
const bcrypt = require("bcryptjs");
const connectDB = require("./Db.Connection");
connectDB();
const seedAdmin = async () => {
  try {
    const name = "mehtab";
    const password = "1122";
    const number = "03430519849";
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      name,
      password: hashedPassword,
      number,
    });
    await admin.save();
    console.log("Admin seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
seedAdmin();
