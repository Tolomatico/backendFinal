const jwt = require("jsonwebtoken")
const configObject = require("../config/config.js")
const { secretKey } = configObject
const passport = require('passport')
const UserDTO = require("../dto/user.dto.js")

function authMiddleware(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        
        if (err) {
            return next(err)
        }
        if (!user) {
            req.user = null
        } else {
            const userDto = new UserDTO(
               user.first_name,
              user.last_name,
               user.email,
                user.rol,
               user.cart,
               user._id
            )
            req.user = userDto
           
        }
       
        next()
    })(req, res, next)

}

module.exports = authMiddleware;




// const authToken = req.get("Authorization")
//     if (!authToken) {
//         return res.status(403).json({ message: "Acceso denegado" })
//     }
//     try {

//         const token = authToken.split(" ")[1]

//         const decoded = jwt.verify(token, secretKey)
//         req.user = decoded.user

//         next()
//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ message: "El token expiró" })
//         }
//         res.status(401).json({ message: "Token inválido" })
//     }