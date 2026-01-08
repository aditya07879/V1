const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      passwordHash,
      role: "user"
    });

    res.redirect("/login");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('invalidcerendial');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.render('invalidcerendial');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};
