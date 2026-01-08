const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();


connectDB();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(require("./middlewares/auth.middleware"));

app.use(require("./middlewares/viewUser.middleware"));


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.use("/", require("./routes/page.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/elections", require("./routes/election.routes"));
app.use("/results", require("./routes/result.routes"));
app.use("/api/candidates", require("./routes/candidate.routes"));
app.use("/api/votes", require("./routes/vote.routes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
