const express = require("express")
const router = express.Router()
const usersModel = require("../models/users.model")


router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age, rol } = req.body
    const userPost = {
        first_name,
        last_name,
        email,
        password,
        age,
        rol: rol ? rol : "user"
    }

    try {

        const user = await usersModel.findOne({email:userPost.email})
        if(!user){
           const newUser= await usersModel.create(userPost)
            req.session.login=true
            req.session.user={
                ...newUser._doc
            }
        
         res.redirect("/products")
        
        }else{
            res.send("Ya se encuentra registrado un usuario con ese email")
        }

    } catch (error) {
        res.status(400).send({ error: "Error al crear el usuario" })
    }

})

module.exports = router