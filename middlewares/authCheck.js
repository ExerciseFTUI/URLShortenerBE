const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to login page or display an error
    res.status(401).json({ success: false, message: req.session.user });
  }
};

module.exports = {
  isAuthenticated,
};
