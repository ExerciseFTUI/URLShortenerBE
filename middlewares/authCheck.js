const isAuthenticated = (req, res, next) => {
  if (req.user) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to login page or display an error
    res.redirect("/");
  }
};

module.exports = {
  isAuthenticated,
};
