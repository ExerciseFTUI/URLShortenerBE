const express = require("express");
const router = express.Router();
const passport = require("passport");

const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:5173";
console.log(`Client URL: ${CLIENT_URL}`);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${CLIENT_URL}`,
    // successRedirect: `http://localhost:5173`,
    failureRedirect: "/auth/login/failed",
    session: true,
  })
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    req.session.user = req.user;
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  } else if (req.session.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.session.user,
      //   cookies: req.cookies
    });
  } else {
    res.status(401).json({
      success: false,
      message: req.session.user,
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    // res.clearCookie("connect.sid"); // Clear the session cookie
    // res.redirect(`${CLIENT_URL}/account/login`);
    res.status(200).json({ success: true, message: "Logout successfully" });
  });
});

const authRoute = router;
module.exports = authRoute;
