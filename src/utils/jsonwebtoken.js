const jwt = require("jsonwebtoken")
const configObject = require("../config/config.js")
const { secretKey } = configObject
const private_key = secretKey

const generateToken = (user) => {
    try {
        const token = jwt.sign(user, private_key, { expiresIn: "1h" })
        return token
    } catch (error) {
        console.error("Error al generar el token:", error)
        return null
    }
}

module.exports = generateToken