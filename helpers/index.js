const winston = require("winston");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { JWT_SECRET } = require("../config")

// Winston logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" })
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
const decodeJwtToken = (paylaod) => {
  const token = jwt.verify(paylaod, JWT_SECRET)
  return token
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

module.exports = { logger, generateJwtToken, decodeJwtToken, hashPassword, comparePassword }