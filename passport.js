const User = require("./models/userModel");
const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create the user in your MongoDB database

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // User does not exist, create a new user
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile._json.picture,
          });
          await user.save();
        }

        if (!user.avatar) {
          await User.findOneAndUpdate(
            { _id: user._id },
            { avatar: profile._json.picture },
            { new: true }
          );
        }

        console.log("User Yang Masuk : ", user);

        // Call the `done` callback with the user object
        done(null, user);
      } catch (error) {
        // Call the `done` callback with the error object
        done(error, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
