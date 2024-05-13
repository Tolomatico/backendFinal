const userModel = require("../../models/users.model.js")


class UserManager {

    async getUserByToken(token) {

        try {
            return userModel.findOne({ token: token })

        } catch (error) {
            console.log(`Error al buscar al usario en la base de datos: ${error}`)
        }
    }

    async getUser(email) {

        try {
            return userModel.findOne({ email })

        } catch (error) {
            console.log(`Error al buscar al usario en la base de datos: ${error}`)
        }
    }

    async getUserById(id) {

        try {
            return userModel.findById({ id })

        } catch (error) {
            console.log(`Error al buscar al usario en la base de datos: ${error}`)
        }
    }


}

module.exports=UserManager