const winston = require("winston");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const { JWT_SECRET, GOOGLE_APP_PASSWORD, GOOGLE_MAIL } = require("../config")

// Winston logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "logs/app.log" })
  ]
});

//create JWT token 
const generateJwtToken = (paylaod, expIn) => {
  const token = jwt.sign(paylaod, JWT_SECRET, {
    expiresIn: expIn
  })
  return token
}

//verify token 
const decodeJwtToken = (token) => {
  const data = jwt.verify(token, JWT_SECRET)
  return data
}

//bcrypt the password 
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 8)
}

//compare password 
const comparePassword = async (password, hPassword) => {
  try {
    return await bcrypt.compare(password, hPassword)
  } catch (error) {
    return false
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GOOGLE_MAIL,
    pass: GOOGLE_APP_PASSWORD,
  },
});

//send Mail
const sendMail = async (to,subject,html) => {
  const mailOptions = {
    from: `"Earena" <${GOOGLE_MAIL}>`,
    to: to,
    subject: subject,
    text : "",
    html: html, 
  }
  const mail = await transporter.sendMail(mailOptions)
}

module.exports = { logger, generateJwtToken, decodeJwtToken, hashPassword, comparePassword, sendMail }