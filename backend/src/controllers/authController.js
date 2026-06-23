import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Log from "../models/Log.js";
import Session from "../models/Session.js";
import generateOTP from "../utils/generateOTP.js";
import { sendOTPEmail } from "../utils/sendEmail.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setCookies,
  clearCookies,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// ── helpers ───────────────────────────────────────────────────────────────────

function parseDeviceInfo(req) {
  const ua = req.headers["user-agent"] || "";
  return {
    userAgent: ua,
    ip: req.ip,
    os: ua.includes("Windows") ? "Windows"
      : ua.includes("Mac") ? "Mac"
      : ua.includes("Linux") ? "Linux"
      : "Unknown",
    browser: ua.includes("Chrome") ? "Chrome"
      : ua.includes("Firefox") ? "Firefox"
      : ua.includes("Safari") ? "Safari"
      : "Unknown",
  };
}

// ── POST /api/auth/register ───────────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Password is manually hashed here — User model has NO pre-save hook
    // Do not add bcrypt pre-save hook to User model or passwords will double-hash
    const hashedPassword = await bcrypt.hash(password, 12);

    const { otp, expiresAt } = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: { code: hashedOTP, expiresAt, attempts: 0 },
    });

    try {
      await sendOTPEmail(email, name, otp);
      console.log(`[MAIL] OTP sent to ${email}`);
    } catch (mailError) {
      console.error("[MAIL ERROR] Register:", mailError.message);
      console.error("[MAIL ERROR] Code:", mailError.code);
      console.error("[MAIL ERROR] Response:", mailError.response);
    }

    await Log.create({
      userId: user._id,
      action: "register",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      message: "Registration successful. OTP sent to your email.",
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────

export const verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "userId and OTP are required" });
    }

    const user = await User.findById(userId).select(
      "+otp.code +otp.expiresAt +otp.attempts"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp.attempts >= 5) {
      return res.status(429).json({ message: "Too many wrong attempts. Register again." });
    }

    if (!user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp.code);

    if (!isMatch) {
      user.otp.attempts += 1;
      await user.save();
      return res.status(400).json({
        message: `Wrong OTP. ${5 - user.otp.attempts} attempts left.`,
      });
    }

    // OTP correct — verify user and clear OTP
    user.isVerified = true;
    user.otp = { code: null, expiresAt: null, attempts: 0 };
    await user.save();

    // Create session instead of storing token on user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Session.create({
      userId: user._id,
      refreshToken,
      deviceInfo: parseDeviceInfo(req),
      isActive: true,
      lastUsed: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setCookies(res, accessToken, refreshToken);

    await Log.create({
      userId: user._id,
      action: "otp_verified",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      message: "Email verified successfully",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/resend-otp ─────────────────────────────────────────────────

export const resendOTP = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const { otp, expiresAt } = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = { code: hashedOTP, expiresAt, attempts: 0 };
    await user.save();

    try {
      await sendOTPEmail(user.email, user.name, otp);
      console.log(`[MAIL] OTP resent to ${user.email}`);
    } catch (mailError) {
      console.error("[MAIL ERROR] Resend:", mailError.message);
      console.error("[MAIL ERROR] Code:", mailError.code);
      console.error("[MAIL ERROR] Response:", mailError.response);
    }

    await Log.create({
      userId: user._id,
      action: "otp_sent",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({ message: "New OTP sent to your email" });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select(
      "+password name email isVerified isActive encryptionPreference totalStorageUsed storageQuota totalFilesUploaded"
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Email not verified. Please verify your OTP.",
        userId: user._id,
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account deactivated. Contact support." });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Create a new session document — supports multiple devices simultaneously
    await Session.create({
      userId: user._id,
      refreshToken,
      deviceInfo: parseDeviceInfo(req),
      isActive: true,
      lastUsed: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setCookies(res, accessToken, refreshToken);

    await Log.create({
      userId: user._id,
      action: "login",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        encryptionPreference: user.encryptionPreference,
        totalStorageUsed: user.totalStorageUsed ?? 0,
        storageQuota: user.storageQuota ?? 100 * 1024 * 1024,
        totalFilesUploaded: user.totalFilesUploaded ?? 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/refresh ────────────────────────────────────────────────────

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify JWT signature first
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Look up the session — not the user
    const session = await Session.findOne({
      refreshToken: token,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Rotate token and update lastUsed
    session.refreshToken = newRefreshToken;
    session.lastUsed = new Date();
    await session.save();

    setCookies(res, newAccessToken, newRefreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/logout ─────────────────────────────────────────────────────

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    // Deactivate only this session, not all sessions
    if (token) {
      await Session.findOneAndUpdate(
        { refreshToken: token, userId: req.user._id },
        { isActive: false }
      );
    }

    clearCookies(res);

    await Log.create({
      userId: req.user._id,
      action: "logout",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      encryptionPreference: user.encryptionPreference,
      totalStorageUsed: user.totalStorageUsed,
      storageQuota: user.storageQuota || 100 * 1024 * 1024,
      totalFilesUploaded: user.totalFilesUploaded,
    },
  });
};

// ── PUT /api/auth/change-password ─────────────────────────────────────────────

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = new Date();
    await user.save();

    // Revoke all sessions on password change — force re-login everywhere
    await Session.updateMany(
      { userId: req.user._id },
      { isActive: false }
    );

    clearCookies(res);

    res.json({ message: "Password changed successfully. Please login again." });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/mlkem-pubkey ───────────────────────────────────────────────

export const saveMlkemPublicKey = async (req, res) => {
  try {
    const { publicKey } = req.body;
    if (!publicKey) return res.status(400).json({ message: "Public key required" });

    await User.findByIdAndUpdate(req.user._id, { mlkemPublicKey: publicKey });
    res.json({ message: "Public key saved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save public key" });
  }
};

// ── POST /api/auth/mlkem-privkey ──────────────────────────────────────────────

export const saveEncryptedPrivateKey = async (req, res) => {
  try {
    const { encryptedPrivateKey, encryptedPrivateKeyIv } = req.body;
    if (!encryptedPrivateKey || !encryptedPrivateKeyIv) {
      return res.status(400).json({ message: "Missing encrypted key data" });
    }
    await User.findByIdAndUpdate(req.user._id, {
      encryptedPrivateKey,
      encryptedPrivateKeyIv,
    });
    res.json({ message: "Encrypted private key saved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save private key" });
  }
};

// ── GET /api/auth/mlkem-privkey ───────────────────────────────────────────────

export const getEncryptedPrivateKey = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "+encryptedPrivateKey +encryptedPrivateKeyIv"
    );
    res.json({
      encryptedPrivateKey: user.encryptedPrivateKey,
      encryptedPrivateKeyIv: user.encryptedPrivateKeyIv,
      mlkemPublicKey: user.mlkemPublicKey,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch private key" });
  }
};