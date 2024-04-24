const winston = require("winston")
const configObject=require("../config/config.js")
const {logger}=configObject

const errorLevel = {
    level: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warn: "blue",
        info: "green",
        http: "magenta",
        debug: "grey"
    }

}



const loggerDevelop = winston.createLogger({
    levels: errorLevel.level,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: errorLevel.colors }),
                winston.format.simple()
            )
        })
    ]
})

const loggerProduction = winston.createLogger({
    level: errorLevel.level,
    transports: [
        new winston.transports.File(
            {
                filename: "./errors.log",
                level: "info",
                
            }
        )
    ]
})

const loggerSelected= logger== "production" ? loggerProduction : loggerDevelop

const addLogger = (req, res, next) => {
   
    req.logger = loggerSelected
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}

module.exports = addLogger