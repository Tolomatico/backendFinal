const userModel = require("../models/users.model.js")
const cartModel = require("../models/carts.model.js")
const { isValidPassword, createHash } = require("../utils/hashBcrypt.js")
const response = require("../utils/reusables.js")
const generateToken = require("../utils/jsonwebtoken.js")
const UserDTO = require("../dto/user.dto.js")


class userController {

    async register(req, res) {

        const { first_name, last_name, age, password, email } = req.body
        try {
            const user = await userModel.findOne({ email: email })
            if (user) {
                return res.status(400).send({ error: "Ya existe un usuario con ese email" })
            }

            const newCart=new cartModel()
            await newCart.save()

            const newUser = await userModel.create({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password.toString()),
                rol: "user",
                cart:newCart
            })

            const token = generateToken({ user: newUser })

            res.cookie("cookieToken",
                token,
                {
                    maxAge: 3600000,
                    httpOnly: true
                })
                .redirect("/api/users/profile")



        } catch (error) {
            return res.status(400).send({ status: "error", message: "Credenciales invalidas" })
        }
    }


    async login(req, res) {
        const { email, password } = req.body

        try {
            const user = await userModel.findOne({ email })
            if (!user) {
                res.status(500).send("Error interno del servidor");

            }
            if (!isValidPassword(password, user)) {
                res.status(500).send("Error interno del servidor");

            }


            const token = generateToken({ user: user })

            res.cookie("cookieToken",
                token,
                {
                    maxAge: 3600000,
                    httpOnly: true
                })
                .redirect("/api/users/profile")


        } catch (error) {
            console.log("Error al autenticarse", error)
            res.status(500).send("Error interno del servidor");

        }

    }

    async profile(req, res) {

        try {
            const userDto = new UserDTO(
                req.user.first_name,
                req.user.last_name,
                req.user.email,
                req.user.rol,
                req.user.cart
            )
    
            const isAdmin = req.user.rol === 'admin';
            res.render("profile", { user: userDto, isAdmin: isAdmin })
        } catch (error) {
            res.status(500).json({message:"Error al cargar la página:",error})
        }
       
    }

    async logout(req, res) {
        res.clearCookie("cookieToken")
        res.redirect("/login")
    }

}





module.exports = userController