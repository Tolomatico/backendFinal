const express = require("express")
const router = express.Router()
const usersModel = require("../models/users.model")
const {isValidPassword} =require("../utils/hashBcrypt")
const passport = require("passport")


/*
router.post("/sessionlogin", async (req, res) => {
    const { email, password } = req.body
   
    try {
        const user = await usersModel.findOne({ email: email })
        if (user) {
            if (isValidPassword(password,user)) {

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
*/

                   /// passport login ///

router.post("/sessionlogin",passport.authenticate("login",{
    failureRedirect:"/api/sessions/faillogin"}),async (req,res)=>{
        if(!req.user){
            return res.status(400).send({status:"error",message:"Credenciales invalidas"})
        }

        req.session.user={
            first_name:req.user.first_name,
            last_name:req.user.last_name,
            age:req.user.age,
            email:req.user.email
        }

        req.session.login=true
        res.redirect("/profile")

    })

router.get("/faillogin",async (req,res)=>{
    try {
        res.send("Error al iniciar sesión")
    } catch (error) {
        console.log(error)
    }
})    

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy()
        
    }
    res.redirect("/login")

})

    
///  Enrutado GitHub ///

router.get("/github",passport.authenticate("github",{scope:["user:email"]}),
async(req,res)=>{
   
})

router.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login",
}),async (req,res)=>{
req.session.user=req.user
req.session.login=true
res.redirect("/profile")
}
)

module.exports = router

