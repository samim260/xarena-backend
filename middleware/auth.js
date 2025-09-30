const {decodeJwtToken} = require("../helpers")

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({ success: false, error: true, message: "invaild access token" });
        }
        const tokenData = decodeJwtToken(token)
        req.user = tokenData
        next()
    } catch (error) {
        return res.status(401).json({ success: false, error: true, message: "invaild access token" });
    }
}