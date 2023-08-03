const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const mainRoute = require("./routes/mainRoute");

const cookieSession = require("cookie-session");
const session = require("express-session");

const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const passportSetup = require("./passport");
const authRoute = require("./routes/authRoute");
const qrcodeRoute = require("./routes/qrcodeRoute");
const Qr = require("./models/qrcodeModel");
const { isAuthenticated } = require("./middlewares/authCheck");

let FileStore = require("session-file-store")(session);

const PORT = process.env.PORT || 5000;
const app = express();

// const NODE_ENV = "production";

// Check if the app is running in production or development
const isProduction = process.env.NODE_ENV === "production";
// const isProduction = NODE_ENV === "production";

// console.log(isProduction);

app.set("trust proxy", 1); //trust first proxy

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_KEY,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: isProduction ? "none" : "lax", // "lax" for non-production environments
      secure: isProduction, // true for production, false for non-production environments
    },
    store: new FileStore(),
  })
);

// app.use(
//   cookieSession({
//     name: "session",
//     keys: [process.env.COOKIE_KEY], // Replace with your desired secret keys
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     sameSite: isProduction ? "none" : "lax",
//     secure: isProduction,
//   })
// );

// Set secure property for production, but not for development
// if (isProduction) {
//   console.log("Production");
//   app.use(
//     cookieSession({
//       name: "session",
//       keys: [process.env.COOKIE_KEY],
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours,
//       secure: true,
//       sameSite: "none",
//     })
//   );
// } else {
//   // Cookie configuration
//   app.use(
//     cookieSession({
//       name: "session",
//       keys: [process.env.COOKIE_KEY],
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     })
//   );
// }
app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://exe-url.vercel.app",
      "https://app.exer.space",
    ],
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
