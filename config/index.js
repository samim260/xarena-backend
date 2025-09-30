require("dotenv").config()


module.exports={
    PORT : process.env.PORT || 8080,
    DB_URL : process.env.DB_URL,
    JWT_SECRET : process.env.JWT_SECRET,
    GOOGLE_APP_PASSWORD : process.env.GOOGLE_APP_PASSWORD,
    GOOGLE_MAIL : process.env.GOOGLE_MAIL
}