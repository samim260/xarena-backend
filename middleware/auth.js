const { decodeJwtToken, logger } = require("../helpers")
const userModel = require("../models/User")

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ success: false, error: true, message: "invaild access token" });
        }
        const tokenData = decodeJwtToken(token)
        req.user = tokenData
        const user = userModel.findById(req.user.id)

        if (!user || user.isVerified || user.isActive) {
            return res.status(401).json({ success: false, error: true, message: "invaild user" });
        }
        next()
    } catch (error) {
        logger.error(`error : ${error}`)
        return res.status(401).json({ success: false, error: true, message: "invaild access token" });
    }
}