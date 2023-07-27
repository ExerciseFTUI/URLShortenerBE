const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const mainRoute = require("./routes/mainRoute");

const cookieSession = require("cookie-session");
const session = require("express-session");
const passport = require("passport");
const passportSetup = require("./passport");
const authRoute = require("./routes/authRoute");
const qrcodeRoute = require("./routes/qrcodeRoute");
const Qr = require("./models/qrcodeModel");

const PORT = process.env.PORT || 5000;
const app = express();

// Check if the app is running in production or development
const isProduction = process.env.NODE_ENV === "production";

// Set secure property for production, but not for development
if (isProduction) {
  app.use(
    cookieSession({
      name: "session",
      keys: [process.env.COOKIE_KEY],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours,
      secure: true,
      sameSite: "none",
    })
  );
} else {
  // Cookie configuration
  app.use(
    cookieSession({
      name: "session",
      keys: [process.env.COOKIE_KEY],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  );
}

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", mainRoute);
app.use("/qr", qrcodeRoute);
app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
