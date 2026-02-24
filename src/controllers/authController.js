const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.json({ error: "name is required" });
    if (!email) return res.json({ error: "email is required" });
    if (!password || password.length < 6)
      return res.json({ error: "password must be at least 6 characters" });

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) return res.json({ error: "email is already taken" });

    const isNameExist = await User.findOne({ name });
    if (isNameExist) return res.json({ error: "name is already taken" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, password: hashPassword, email });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: `user register successfully name:${name}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "no user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ error: "credential is wrong" });
    }

    res.status(200).json({ success: true, message: "login successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If this email exists, a reset link has been sent.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      text: `${process.env.FRONT_END_URL}/resetPassword/${user._id}/${token}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.json({ error: "password must be atleast 6 charater" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Token verification failed" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, {
      password: hashPassword,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
