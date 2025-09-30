const { logger, generateJwtToken, hashPassword, comparePassword } = require("../helpers")
const { signUpSchema, loginSchema } = require("../validations/user.validation")
const UserModel = require("../models/User")


class User {
    async signUp(req, res) {
        try {
            // check request body validation 
            const { error, value } = signUpSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: true, message: error.details[0].message });
            }
            req.body = value;


            //check if user already exists 
            const isExists = await UserModel.findOne({ email: req.body.email })
            if (isExists) {
                return res.status(400).json({ success: false, error: true, message: "User already exists" });
            }

            //hash password and create user
            const hashPasword = await hashPassword(req.body.password)
            const user = await UserModel.create({
                username: req.body.username,
                email: req.body.email,
                balance: 0,
                password: hashPasword
            })


            return res.json({ success: true, error: false, data: user })
        } catch (error) {
            logger.error("error ", error.message)
            return res.json({ success: false, error: true, message: error.message })
        }
    }

    async login(req, res) {
        try {
            const { error, value } = loginSchema.validate(req.body)
            if (error) {
                return res.status(400).json({ success: false, error: true, message: error.details[0].message });
            }
            req.body = value;

            const user = await UserModel.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json({ success: false, error: true, message: "User do not exists" });
            }

            const checkPassword = await comparePassword(req.body.password, user.password)

            if (!checkPassword) {
                return res.status(400).json({ success: false, error: true, message: "User do not exists" });
            }

            const accessToken = generateJwtToken({ id: user.id, username: user.username, role: user.role }, '1d')
            const refreshToken = generateJwtToken({ id: user.id, username: user.username, role: user.role }, '100d')

            user.refreshToken = refreshToken
            await user.save()

            user.accessToken = accessToken
            user.password = null;

            res.json({ success: true, error: false, message: "login successful", data: { ...user.toJSON(), accessToken } })


        } catch (error) {
            logger.error("error ", error.message)
            return res.json({ success: false, error: true, message: error.message })
        }
    }
}

module.exports = User