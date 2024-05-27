const dotenv=require("dotenv")
const program=require("../utils/commander.js")

const {mode}=program.opts()

dotenv.config({
    path:mode==="production" ? "./.env.production" : "./.env.develop"
})

const configObject={
    mongo_url:process.env.MONGO_URL,
    secretKey:process.env.SECRET_KEY,
    logger:process.env.LOGGER,
    base_url:process.env.BASE_URL
}

module.exports=configObject