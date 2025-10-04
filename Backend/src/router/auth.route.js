const express = require("express")
const dealerAuth = require("../controllers/dealerUser.controller")
const router = express.Router()


router.post("/signup", dealerAuth.signup);
router.post("/login", dealerAuth.login);


module.exports = router