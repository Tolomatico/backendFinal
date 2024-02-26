const express = require("express")
const router = express.Router()
const usersModel = require("../models/users.model")


router.post("/sessionlogin", async (req, res) => {
    const { email, password } = req.body
   
    try {
        const user = await usersModel.findOne({ email: email })
        if (user) {
            if (user.password === password) {
                req.session.login = true
                req.session.user={
                    ...user._doc
                }
             
                res.redirect("/products")
                
            } else {
                res.status(401).send({ error: "Contraseña invalida" })
            }
        }
        else {
            res.status(404).send("Usuario no encontrado")
        }
    } catch (error) {
        
        res.status(400).send({ error: "Error en el login" })

    }
})


router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy()
        
    }
    res.redirect("/login")

})

module.exports = router

