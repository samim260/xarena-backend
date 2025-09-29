const Joi = require("joi")

const signUpSchema = Joi.object({
    username: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
})


module.exports = { signUpSchema, loginSchema }