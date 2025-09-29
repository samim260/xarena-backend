const router = require("express").Router()
const User = require("../controller/user.controller")

const auth = new User()

router.post("/signup", auth.signUp)
router.post("/login", auth.login)

module.exports = router