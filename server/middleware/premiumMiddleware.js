const User = require("../models/User");

async function premiumMiddleware(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isPremium) {
      return res.status(403).json({ message: "Premium membership required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = premiumMiddleware;