const Election = require("../models/Election.model");

exports.homePage = async (req, res) => {
  const elections = await Election.find().select("-voterKey");
  res.render("home", { elections });
};


exports.loginPage = (req, res) => {
  res.render("login");
};

exports.registerPage = (req, res) => {
  res.render("register");
};
