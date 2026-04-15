const File = require("../models/File");
const Log = require("../models/Log");
const { encryptFile, decryptFile } = require("../services/cryptoService");
const { uploadFile, getSignedUrl, deleteFile } = require("../services/r2Service");
const { v4: uuidv4 } = require("uuid");


// UPLOAD FILE
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;

    // Step 1: Encrypt via crypto service
    const { encryptedFile, encryptedKey } = await encryptFile(fileBuffer);

    // Step 2: Upload encrypted file to R2
    const cloudKey = uuidv4();

    await uploadFile(
      Buffer.from(encryptedFile, "base64"),
      cloudKey
    );

    // Step 3: Save metadata
    const file = await File.create({
      userId: req.user,
      originalName: req.file.originalname,
      cloudKey,
      encryptedAESKey: encryptedKey,
      expiresAt: req.body.expiresAt || null,
      downloadLimit: req.body.downloadLimit || null
    });

    // Step 4: Log
    await Log.create({
      userId: req.user,
      action: "UPLOAD",
      fileId: file._id
    });

    res.status(201).json({
      msg: "File uploaded successfully",
      fileId: file._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Upload failed" });
  }
};


// GET USER FILES
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user })
      .sort({ createdAt: -1 });

    res.json(files);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching files" });
  }
};


// DOWNLOAD FILE (secure flow)
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    if (file.userId.toString() !== req.user) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Self-destruct checks
    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(403).json({ msg: "File expired" });
    }

    if (file.downloadLimit && file.downloadCount >= file.downloadLimit) {
      return res.status(403).json({ msg: "Download limit reached" });
    }

    // Generate signed URL (secure access)
    const signedUrl = getSignedUrl(file.cloudKey);

    // Update count
    file.downloadCount += 1;
    await file.save();

    // Log
    await Log.create({
      userId: req.user,
      action: "DOWNLOAD",
      fileId: file._id
    });

    res.json({
      url: signedUrl,
      fileName: file.originalName
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Download failed" });
  }
};


// DELETE FILE
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    if (file.userId.toString() !== req.user) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Delete from R2
    await deleteFile(file.cloudKey);

    // Delete from DB
    await file.deleteOne();

    // Log
    await Log.create({
      userId: req.user,
      action: "DELETE",
      fileId: file._id
    });

    res.json({ msg: "File deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};