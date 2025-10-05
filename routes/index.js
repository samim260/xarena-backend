const router = require("express").Router()
const { logger } = require("../helpers")

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: Date.now()
    })
})
router.use("/user", require("./user"))
router.use("/team", require("./team"))
router.use("/invite", require("./invite"))

module.exports = router