const express = require("express");
const router = express.Router();
const Controller = require("../Controllers/admin.Controller");
const { VerifyActor } = require("../Middlewares/authMiddleware");

router.post("/login", Controller.Login);
router.get("/me", VerifyActor, Controller.getMe);
module.exports = router;
