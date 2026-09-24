const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendPasswordResetEmail = require("../utils/sendPasswordResetEmail");

const checkPasswordStrength = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Password needs at least one number";
  return null;
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const strengthError = checkPasswordStrength(password);
    if (strengthError) {
      return res.status(400).json({ message: strengthError });
    }

    const emailTaken = await User.findOne({ email: email.toLowerCase() });
    if (emailTaken) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, passwordHash });
    generateToken(res, user._id);

    return res.status(201).json({ message: "Account created", user });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        message: `${field === "email" ? "Email" : "Username"} is already taken`,
      });
    }
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // need +passwordHash because schema has select: false
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateToken(res, user._id);
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const logout = (_req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  return res.status(200).json({ message: "Logged out" });
};

const getMe = (req, res) => {
  return res.status(200).json({ user: req.user });
};

const forgotPassword = async (req, res) => {
  const genericMessage = "If an account exists for that email, a password reset link has been sent.";

  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found for this email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordTokenHash = resetPasswordTokenHash;
    user.resetPasswordExpiresAt = new Date(Date.now() + 20 * 60 * 1000);
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      user.resetPasswordTokenHash = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();
      throw emailError;
    }

    return res.status(200).json({ message: genericMessage });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(200).json({ message: genericMessage });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const strengthError = password ? checkPasswordStrength(password) : "Password is required";
    if (strengthError) return res.status(400).json({ message: strengthError });

    const resetPasswordTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordTokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
    }).select("+resetPasswordTokenHash +resetPasswordExpiresAt");

    if (!user) return res.status(400).json({ message: "This reset link is invalid or has expired" });

    user.passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(12));
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ message: "Unable to reset password" });
  }
};

module.exports = { register, login, logout, getMe, forgotPassword, resetPassword };
