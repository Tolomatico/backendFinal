const passport = require("passport")
const local = require("passport-local")
const GitHubStrategy = require("passport-github2")
const usersModel = require("../models/users.model")
const { createHash, isValidPassword } = require("../utils/hashBcrypt")


const LocalStrategy = local.Strategy

const initilizePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, rol } = req.body
        try {
            let user = await usersModel.findOne({ email })
            if (user) {
                return done(null, false)
            } else {
                let newUser = {
                    first_name,
                    last_name,
                    email,
                    password: createHash(password.toString()),
                    age,
                    rol: rol ? rol : "user"
                }

                let result = await usersModel.create(newUser)
                return done(null, result)
            }
        } catch (error) {
            return done(error)
        }

    }))
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await usersModel.findOne({ email })
            if (!user) {
                console.log("No existe un usuario con ese email.")
                return done(null, false)
            } else {
                if (!isValidPassword(password.toString(), user)) {
                    return done(null, false)
                } else {
                    return done(null, user)
                }
            }

        } catch (error) {
            return done(error)
        }
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById({ _id: id })
        done(null, user)
    })

    /// Github strategy ///

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.d7375a3dc3ccf079",
        clientSecret: "20a0af96db7c68f0449c9ee7c04922ff0befe5a2",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"

    }, async (accessToken, refreshToken, profile, done) => {
       const name= profile._json.name.split(" ")
        try {

            let user = await usersModel.findOne({ email: profile._json.email })
            if (!user) {

                let newUser = {
                    first_name: name[0],
                    last_name: name[1],
                    email: profile._json.email,
                    password: createHash(profile._json.id.toString()),
                    age: 18,
                    rol: "user"
                }
                let result = await usersModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }


        } catch (error) {
            return done(error)
        }
    }))

}

module.exports = initilizePassport
