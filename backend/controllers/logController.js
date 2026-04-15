const Log = require("../models/Log");

// GET USER LOGS
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user })
      .populate("fileId", "originalName")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching logs" });
  }
};