const express = require("express")
const auth = require("../controllers/user.controller")
const router = express.Router()
const {verifyTokenMiddleware} = require("../middlewares/verifyToken")

router.post('/verify-token', verifyTokenMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

router.post("/signup", auth.signup);
router.post("/login", auth.login);


router.post("/profile",verifyTokenMiddleware,  auth.profile);
// router.post("/logout", auth.logout);


module.exports = router