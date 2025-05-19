const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { name, mobile, email, pin } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const newUser = new User({
      name,
      mobile,
      email,
      pin: hashedPin,
      plainPin: pin // 🔥 only for testing
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login route
router.post("/login", async (req, res) => {
  const { email, pin } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔍 Get all users (only name, mobile, and email)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name mobile email"); // fetch specific fields only
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const nodemailer = require("nodemailer");

// 🔐 FORGOT PASSWORD ROUTE
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.plainPin) {
      return res.status(404).json({ message: "User not found or PIN unavailable" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gsandipdipofficial@gmail.com", // 🔁 Replace with your Gmail
        pass: "eefttnwxnouhzcxc"      // 🔁 Replace with Gmail App Password
      }
    });

    const mailOptions = {
      from: "yourgmail@gmail.com",
      to: email,
      subject: "Your TravelSite PIN",
      text: `Hello ${user.name},\n\nYour PIN is: ${user.plainPin}\n\nKeep it safe!\n\n Trip Travel`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "PIN sent to your email!" });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});



module.exports = router;
