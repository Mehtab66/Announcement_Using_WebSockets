const express = require("express");
const router = express.Router();
const announcementController = require("../Controllers/announcement.Controller");
const { VerifyActor } = require("../Middlewares/authMiddleware");

//make an announcement
router.post(
  "/makeannouncement",
  VerifyActor,
  announcementController.MakeAnAnnouncement
);

//get announcements
router.get("/getannouncements", announcementController.GetAnnouncements);
module.exports = router;
