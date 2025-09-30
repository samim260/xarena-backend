const mongoose = require("mongoose")


const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avater: {
        type: String,
        required: false,
        trim: true
    },
    refreshToken: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    role: {
        type : String,
        default : 'user'
    }
}, {
    versionKey: false,
    timestamps: true
})

const User = mongoose.model("user", schema);

module.exports = User