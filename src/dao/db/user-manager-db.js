const userModel = require("../../models/users.model.js")


class UserManager {

    async getUser(email) {

        try {
            return userModel.findOne({ email })

        } catch (error) {
            console.log(`Error al buscar al usario en la base de datos: ${error}`)
        }
    }


}

module.exports=UserManager