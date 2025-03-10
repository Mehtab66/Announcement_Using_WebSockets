const Announcement = require("../Models/Announcement.Model");

// Make An Announcement
module.exports.MakeAnAnnouncement = async (req, res) => {
  const io = req.app.get("io"); // Get io from app

  try {
    const { title, description } = req.body;

    if (!req.admin) {
      return res
        .status(403)
        .json({ message: "Only admins can make announcements" });
    }

    const adminId = req.admin.id;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const announcement = new Announcement({
      title,
      description,
      admin: adminId,
    });

    await announcement.save();

    if (!io) {
      console.error("Socket.IO instance (io) is undefined");
      throw new Error("Socket.IO not initialized");
    }

    io.emit("announcement", {
      title: announcement.title,
      description: announcement.description,
      admin: announcement.admin,
      timestamp: announcement.timestamp || new Date(),
    });

    res.status(200).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (err) {
    console.error("Error in MakeAnAnnouncement:", err);
    res.status(500).json({ message: err.message });
  }
};

//getAnnouncements

module.exports.GetAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate("admin", "name number  ");
    res.status(200).json(announcements);
  } catch (err) {
    console.error("Error in GetAnnouncements:", err);
    res.status(500).json({ message: err.message });
  }
};
