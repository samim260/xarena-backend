const mongoose = require("mongoose")
const { DB_URL } = require("./index")
const { logger } = require("../helpers")

async function connectDatabase() {
    try {
        await mongoose.connect(DB_URL)
        // logger.info("database connected")
    } catch (error) {
        logger.error("database connection failed : ", error.message)
        process.exit(1)
    }
}

module.exports = connectDatabase