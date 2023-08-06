const MongoStore = require("connect-mongo");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const store = require("../config/mongoStore");

const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:5173";
console.log(`Client URL: ${CLIENT_URL}`);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: `${CLIENT_URL}`,
//     // successRedirect: `http://localhost:5173`,
//     failureRedirect: "/auth/login/failed",
//   })
// );

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login/failed" }),
  function (req, res) {
    console.log(req.user.fakultas);
    if (!req.user.fakultas) {
      res.redirect(`${CLIENT_URL}/account/fill-data`);
    } else {
      // Successful authentication, redirect home.
      res.redirect(`${CLIENT_URL}`);
    }
  }
);

// router.get("/google/callback", (req, res, next) => {
//   passport.authenticate("google", (err, user) => {
//     console.log(`User: ${user}`);
//     if (err) {
//       res.redirect("auth/login/failed"); // Redirect to login/failed on error
//     }

//     //Check fakultas and jurusan field
//     const condition = user.fakultas && user.jurusan;
//     res.redirect(
//       condition ? `${CLIENT_URL}` : `${CLIENT_URL}/account/fill-data`
//     );
//   })(req, res, next);
// });

router.get("/login/success", (req, res) => {
  console.log(req.sessionID);

  // console.log(req.session.user.googleId === req.user.googleId);

  // Check if there was req.session before
  // Check req.session.user and req.user if it different then reupdate req.session
  if (
    req.session.user &&
    req.session.user.googleId === req.user.googleId &&
    req.session.user._id === req.user._id
  ) {
    console.log("User udah login sebelumnya");

    return res.status(200).json({
      success: true,
      message: "successfull",
      user: req.session.user,
      //   cookies: req.cookies
    });
  }
  if (req.user) {
    console.log("User ganti akun");

    //reupdate req.session
    req.session.user = req.user;

    return res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  } else {
    console.log("gagal cuy");
    return res.status(401).json({
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
  console.log(req.sessionID);
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }

    if (req.session) {
      store.destroy(req.sessionID, (err) => {
        if (err) {
          console.error("Error destroying session:", err);
        } else {
          res
            .status(200)
            .json({ success: true, message: "Logout successfully" });
        }
      });
    }

    res.status(200).json({ success: true, message: "Logout successfully" });
  });

  // If using connect-mongo, you can delete the session data from the database using its method
  // if (req.session) {
  //   MongoStore.destroy(req.sessionID, (err) => {
  //     if (err) {
  //       console.error("Error destroying session:", err);
  //     } else {
  //       res.status(200).json({ success: true, message: "Logout successfully" });
  //     }
  //   });
  // } else {
  //   // If req.session is not present, just respond with a successful logout message
  //   res.status(200).json({ success: true, message: "Logout successfully" });
  // }
});

const authRoute = router;
module.exports = authRoute;
