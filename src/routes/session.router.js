const express = require("express")
const router = express.Router()
const passport = require("passport")

router.get("/facebook", passport.authenticate("facebook"))

router.get("/facebook/callback", passport.authenticate(
    "facebook", { failureRedirect: "/login" }),
    async (req, res) => {
      
            res.redirect("/api/users/profile")
        
    })


///  Enrutado GitHub ///
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true
    res.redirect("/api/users/profile")

})

module.exports = router

