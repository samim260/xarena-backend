const router = require("express").Router()
const User = require("../controller/user.controller")
const authMiddleware = require("../middleware/auth")

const auth = new User()

router.post("/signup", auth.signUp)
router.post("/login", auth.login)
router.post("/verifyotp", authMiddleware, auth.verifyOtp)

module.exports = router