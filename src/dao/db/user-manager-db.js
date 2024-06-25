const userModel = require("../../models/users.model.js")


class UserManager {

    async save(data){
        try {
            return userModel.create(data)
            
        } catch (error) {
            console.log("Error al crear el usuario")
        }
    }

    async getUserByToken(token) {

        try {
            return userModel.findOne({ token: token })

        } catch (error) {
            console.log(`Error al buscar al usario en la base de datos: ${error}`)
        }
    }

    async getUser(email) {

        try {
            return userModel.findOne({ email:email })

        } catch (error) {
            console.log(`Error al buscar al usario en la base de datos: ${error}`)
        }
    }

    async get(data) {

        try {
            return userModel.findOne(data)

        } catch (error) {
            console.log(`Error al buscar al usario en la base de datos: ${error}`)
        }
    }

    async getUsers() {

        try {
            return userModel.find()

        } catch (error) {
            console.log(`Error al buscar usuarios en la base de datos: ${error}`)
        }
    }

    async getUserById(id) {
        
        try {
            return userModel.findById({ id:id })

        } catch (error) {
            console.log(`Error al buscar al usario en la base de datos: ${error}`)
        }
    }

    async delete(id){
       
        try {
            return userModel.findOneAndDelete({_id:id})
            
        } catch (error) {
            console.log("Error al eliminar el usuario",error)
        }
    }


}

module.exports=UserManager