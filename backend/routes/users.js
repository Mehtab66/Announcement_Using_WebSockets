var express = require("express");
var router = express.Router();
const userController = require("../Controllers/user.Controller");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
module.exports = router;
