import mongoose from "mongoose";

// NOTE: Password hashing is handled manually in authController
// Do not add a pre-save bcrypt hook here or passwords will double-hash
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
      attempts: { type: Number, default: 0, select: false },
    },
    // refreshToken removed — sessions are now tracked in the Session collection
    // which supports multiple devices simultaneously
    twoFactorSecret: {
      type: String,
      select: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
    lastLoginAt: {
      type: Date,
    },
    lastLoginIp: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    encryptionPreference: {
      type: String,
      enum: ["aes-only", "hybrid"],
      default: "hybrid",
    },
    totalFilesUploaded: {
      type: Number,
      default: 0,
    },
    totalStorageUsed: {
      type: Number,
      default: 0,
    },
    storageQuota: {
      type: Number,
      default: 100 * 1024 * 1024, // 100MB
    },
    mlkemPublicKey: {
      type: String,
      default: null,
    },
    encryptedPrivateKey: {
      type: String,
      select: false,
      default: null,
    },
    encryptedPrivateKeyIv: {
      type: String,
      select: false,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;