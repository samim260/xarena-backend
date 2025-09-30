const express = require('express')
const helmet = require('helmet')
const cors = require("cors")
const { rateLimit }  =  require('express-rate-limit')
const morgan = require("morgan")
const cookieParser = require("cookie-parser");
const app = express()
const connectDatabase = require("./config/database")



//security middlewares
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"]
}))
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
	limit: 500, 
}))
app.use(helmet())

//http logger
app.use(morgan('common'))

// json & cookie middlewares
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


//routers
app.use("/api",require("./routes"))

connectDatabase()


module.exports = app