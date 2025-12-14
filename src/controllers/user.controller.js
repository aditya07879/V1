const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const updateData = {};

    if (name && name.trim() !== "") {
      updateData.name = name.trim();
    }

    if (email && email.trim() !== "") {
      updateData.email = email.trim().toLowerCase();
    }

    if (password && password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.redirect("/profile");
    }

    const newToken = jwt.sign(
      {
        id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", newToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false 
    });

    res.redirect("/profile");

  } catch (error) {
    res.redirect("/profile");
  }
};
