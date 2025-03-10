const express = require("express");
const router = express.Router();
const Controller = require("../Controllers/admin.Controller");

router.post("/login", Controller.Login);
module.exports = router;
