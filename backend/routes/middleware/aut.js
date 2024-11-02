// middleware/auth.js
function ensureAuthenticatedAndVerified(req, res, next) {
    if (req.session.userId && req.session.isVerified) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized: Please verify your email." });
  }
  
  module.exports = ensureAuthenticatedAndVerified;
  