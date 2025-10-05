const { logger, generateJwtToken, hashPassword, comparePassword, sendMail, decodeJwtToken } = require("../helpers")
const { signUpSchema, loginSchema } = require("../validations/user.validation")
const { VerificationMail } = require("../helpers/mailTemplate")
const mongoose = require("mongoose")
const crypto = require("crypto");
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
            const otp = crypto.randomInt(100000, 999999).toString();
            const user = await UserModel.create({
                username: req.body.username,
                email: req.body.email,
                balance: 0,
                password: hashPasword,
                otp: {
                    code: otp,
                    expiry: Date.now() + (5 * 60 * 1000)
                }
            })


            const accessToken = generateJwtToken({ id: user.id, username: user.username, role: user.role }, '1d')
            const refreshToken = generateJwtToken({ id: user.id, username: user.username, role: user.role }, '100d')

            user.refreshToken = refreshToken
            await user.save()


            //send mail
            const mailBody = VerificationMail(user.username, user.otp.code)
            await sendMail(user.email, "Welcome to Earena! Please Confirm Your Email", mailBody)

            return res.cookie("token", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000 //1h
            }).cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 100 * 24 * 60 * 60 * 1000, // 100 days
            }).json({
                success: true, error: false, data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            })
        } catch (error) {
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
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

            return res.cookie("token", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            }).cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 100 * 24 * 60 * 60 * 1000, // 100 days
            })
                .json({
                    success: true, error: false, data: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                })


        } catch (error) {
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }

    async verifyOtp(req, res) {
        try {
            const { otp } = req.body
            if (!otp) {
                return res.status(400).json({ success: false, error: true, message: "please send otp" });
            }
            const user = await UserModel.findById(req.user.id)
            if (user.otp.code != otp || user.otp.expiry < Date.now()) {
                return res.status(400).json({ success: false, error: true, message: "invaild or expired otp" });
            }
            user.isVerified = true
            user.isActive = true
            user.save();
            return res.json({ success: true, error: false })
        } catch (error) {
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }

    async getUser(req, res) {
        try {
            const user = await UserModel.findById(req.user.id).select({ password: 0, otp: 0, role: 0 })
            if (!user) {
                return res.status(400).json({ success: false, error: true, message: "invalid user please log in" });
            }
            return res.json({ success: true, error: false, data: user })
        } catch (error) {
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }

    async getUserById(req, res) {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ success: false, error: true, message: "no user found" });
            }
            const user = await UserModel.findById(req.params.id).select({ password: 0, otp: 0, role: 0 })
            if (!user) {
                return res.status(400).json({ success: false, error: true, message: "no user found" });
            }
            return res.json({ success: true, error: false, data: user })
        } catch (error) {
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }

    async refreshAccessToken(req, res) {
        try {
            const refreshTkn = req.cookies.refreshToken
            const userData = decodeJwtToken(refreshTkn)
            const user = await UserModel.findById(userData.id).select({ password: 0, otp: 0, role: 0 })
            if (!user) {
                return res.status(400).json({ success: false, error: true, message: "invalid user please log in" });
            }
            if (refreshTkn == user.refreshToken) {
                const accessToken = generateJwtToken({ id: user.id, username: user.username, role: user.role }, '1d')
                const refreshTokenNew = generateJwtToken({ id: user.id, username: user.username, role: user.role }, '100d')

                user.refreshToken = refreshTokenNew
                await user.save()

                return res.cookie("token", accessToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000
                }).cookie("refreshToken", refreshTokenNew, {
                    httpOnly: true,
                    maxAge: 100 * 24 * 60 * 60 * 1000, // 100 days
                })
                .json({
                    success: true, error: false
                })
            }
            return res.status(400).json({ success: false, error: true, message: "refresh token is not valid" })
        } catch (error) {
            console.log(error)
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
}

module.exports = User