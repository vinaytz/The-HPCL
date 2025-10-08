const jwt = require("jsonwebtoken");

function verifyTokenMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id; // store user id for later
    console.log(req.userId)
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}



module.exports = {verifyTokenMiddleware}