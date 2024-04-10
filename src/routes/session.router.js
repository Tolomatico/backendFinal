const express = require("express")
const router = express.Router()

const passport = require("passport")


const UserController=require("../controllers/user.controller.js")
const userController = new UserController()

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send(req.user)
})

router.get("/faillogin", async (req, res) => {
    try {
        res.send("Error al iniciar sesión")
    } catch (error) {
        console.log(error)
    }
})

///  Enrutado GitHub ///

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {

    })

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    req.session.user = req.user
    req.session.login = true
    res.redirect("/profile")
}
)

router.get("/facebook", passport.authenticate("facebook"))

router.get("/facebook/callback", passport.authenticate(
    "facebook", { failureRedirect: "/login" }),
    async (req, res) => {
        req.session.user = req.user
        req.session.login = true
        res.redirect("/profile")
    })



module.exports = router

