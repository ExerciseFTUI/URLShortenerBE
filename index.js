const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const mainRoute = require("./routes/mainRoute");

const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./passport");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["secret"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", mainRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
