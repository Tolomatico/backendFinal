const passport = require("passport")
const local = require("passport-local")
const GitHubStrategy = require("passport-github2")
const FacebookStrategy = require("passport-facebook").Strategy
const usersModel = require("../models/users.model")
const { createHash, isValidPassword } = require("../utils/hashBcrypt")
const jwt = require("passport-jwt")
const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt
const LocalStrategy = local.Strategy
const configObject = require("./config.js")
const { secretKey } = configObject
const cartModel=require("../models/carts.model.js")
const generateToken = require("../utils/jsonwebtoken.js")
const UserManager=require("../dao/db/user-manager-db.js")
const userManager=new UserManager()

const initilizePassport = () => {

    /// Github strategy ///

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.d7375a3dc3ccf079",
        clientSecret: "20a0af96db7c68f0449c9ee7c04922ff0befe5a2",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"

    }, async (accessToken, refreshToken, profile, done) => {

        const name = profile._json.name.split(" ")

        try {

            let user = await usersModel.findOne({ email: profile._json.email })

            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 18,
                    email: profile._json.email,
                    password: ""
                }
                let result = await usersModel.create(newUser);
                done(null, result)
            } else {
                done(null, user)
            }


        } catch (error) {
            return done(error)
        }
    }))

    /// Facebook Strategy ///

    passport.use(new FacebookStrategy({
        clientID: 748905424001448,
        clientSecret: "8d4aa4796fae63e2b1347e90878dac92",
        callbackURL: "http://localhost:8080/api/sessions/facebook/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        const user = await usersModel.findOne({
            accountId: profile.id,
            provider: "Facebook"
        })

        if (!user) {
            
            const newUser = new usersModel({
                first_name: profile.displayName,
                accountId: profile.id,
                provider: "Facebook"
            })
            await newUser.save()
            return done(null, profile)
        } else {
            console.log("El usuario ya existe en nuestra bd")
            return done(null, profile)
        }
    }))


    /// Serialize and Deserialize ///

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done) => {
        let user = await userManager.getUserById({_id:id})
        done(null, user)
    })

    /// JWT Strategy ///

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: secretKey
    }, async (jwt_payload, done) => {
      
        try {
            
            const user = await userManager.getUser(jwt_payload.user.email)
            if (!user) {
                return done(null, false)
            }
            return done(null, user);
        } catch (error) {
            return done(error)
        }
    }))


}

const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies["cookieToken"]
    }
    return token
}



module.exports = initilizePassport




// const name = profile.displayName.split(" ")

// try {

//     let user = await usersModel.findOne({
//         accountId: profile.id,
//         provider: "facebook"
//     })
//     if (!user) {

//         // const newCart = new cartModel()
//         // await newCart.save()

//         let newUser = {
//             first_name: name[0],
//             last_name: name[1],
//             email: "",
//             password: createHash(profile.id.toString()),
//             age: 18,
//             rol: "user",
//             accountId: profile.id,
//             provider: "facebook",
            
//         }
//         // cart:newCart

//         let result = await usersModel.create(newUser)
//         // const token=generateToken(newUser)
