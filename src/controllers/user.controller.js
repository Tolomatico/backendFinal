const userModel = require("../models/users.model.js")
const cartModel = require("../models/carts.model.js")
const { isValidPassword, createHash } = require("../utils/hashBcrypt.js")
const { response, verifyEmail } = require("../utils/reusables.js")
const generateToken = require("../utils/jsonwebtoken.js")
const UserDTO = require("../dto/user.dto.js")
const UserManager = require("../dao/db/user-manager-db.js")
const transport = require("../config/transport.js")
const userManager = new UserManager()
const bcrypt = require("bcrypt")
const generateTokenRecover = require("../utils/token.js")
const usersModel = require("../models/users.model.js")




class userController {

   

    async changeRole(req, res) {
        const id = req.params.uid

        try {
            const user = await usersModel.findById(id)

            if (!user) return response(res, 401, "El usuario no existe.")

            const newRol = user.rol === "user" ? "premium" : "user"

            await usersModel.findByIdAndUpdate(id, { rol: newRol }, { new: true })

            response(res, 201, `El usuario cambio su rol a: ${newRol}`)


        } catch (error) {
            response(res, 401, "Error al querer cambiar de rol.")
        }


    }

    async recover(req, res) {
        const { email } = req.body

        try {

            if (!verifyEmail(email)) {
                return res.render("passrecover", {
                    error: "Ingrese un email válido."
                })
            }
            const user = await userManager.getUser(email)
            if (!user) {
                return res.render("passrecover", {
                    error: "No existe un usuario con ese email."
                })
            }

            const tokenRecover = generateTokenRecover()

            user.token = tokenRecover


            await user.save()

            transport.sendMail({
                from: "BackendCoderhouse",
                to: user.email,
                subject: "Recupera tu password",
                text: "Recupera tu password",
                html: `
                    <p>Hola ${user.first_name}, recupera tu password.</p>
                    <p>${user.token}</p>
                    <p>Ingresa el codigo para poder recuperar tu password:

                    <a href="http://localhost:8080/api/users/recoverpassword">Recuperar password</a></p>
                `
            })

            return res.cookie("cookieToken",
                tokenRecover,
                {
                    maxAge: 60000,
                    httpOnly: true
                }).render("message", {
                    pag: "Reestablecer el Password",
                    message: "Hemos envíado un email ah:",
                    email: user.email
                })

        } catch (error) {
            response(res, 404, "Error al recibir el mail.")
        }
    }

    async getRecover(req, res) {
        const tokenRecover = req.cookies.cookieToken
        if (tokenRecover) {
            const expirationDate = new Date(req.cookies.cookieToken.expires)
            const isExpired = expirationDate <= new Date()

            if (isExpired) {

                return res.render("message", {
                    pag: "Reestablecer el password",
                    message: "El tiempo para restablecer el password ah caducado"
                })
            } else {

                return res.render("passchange", {
                    pag: "Cambia tu contraseña"
                })
            }
        } else {
            return res.render("message", {
                pag: "Reestablecer el password",
                message: "El tiempo para restablecer el password ah caducado"
            })
        }



    }

    async recoverPassword(req, res) {

        const { password, repited, token } = req.body

        try {
            const user = await userManager.getUserByToken(token)

            if (!user) {
                return res.render("passchange", {
                    error: "Codigo de verificación inválido"
                })

            }

            if (user) {

                const repitedPasswords = bcrypt.compareSync(password, user.password)
                if (password.length < 6) {
                    return res.render("passchange", {
                        error: "El password debe tener almenos 6 caracteres"
                    })
                }
                if (password !== repited) {
                    return res.render("passchange", {
                        error: "Los passwords deben coincidir"
                    })

                }

                if (repitedPasswords) {
                    return res.render("passchange", {
                        error: "El password debe ser distinto al anterior"
                    })
                }

                user.password = createHash(password)
                user.token = ""
                await user.save()

                return res.redirect("/login")
            }


        } catch (error) {
            response(res, 404, "Error al cambiar contraseña")

        }




    }

    async register(req, res) {

        const { first_name, last_name, age, password, email } = req.body
        try {
            const user = await userManager.getUser(email)
            if (user) {
                return res.status(400).send({ error: "Ya existe un usuario con ese email" })
            }

            const newCart = new cartModel()
            await newCart.save()

            const newUser = await userManager.save({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password.toString()),
                rol: "user",
                cart: newCart
            })



            res.status(201).json({ status: "success", message: "Usuario registrado correctamente", payload: newUser })



        } catch (error) {
            return res.status(400).send({ status: "error", message: "Credenciales invalidas" })
        }
    }


    async login(req, res) {
        const { email, password } = req.body
        try {
            if (!verifyEmail(email)) {
                return res.render("login", {
                    error: "Ingrese un email válido"
                })
            }



            const user = await userManager.getUser(email)
            if (!user) {
                return res.render("login", {
                    error: "No existe un usuario con ese email"
                })
            }

            if (!isValidPassword(password, user)) {
                return res.render("login", {
                    error: "La contraseña no es correcta",
                    email: email
                })
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

            req.logger.warn("Error interno del servidor.")
            res.redirect("/login")
        }

    }

    async profile(req, res) {

        try {

            if (req.session.login) {

                return res.render("profile", { user: req.session.user })
            }
            const userDto = new UserDTO(
                req.user.first_name,
                req.user.last_name,
                req.user.email,
                req.user.rol,
                req.user.cart
            )

            const isAdmin = req.user.rol === 'admin'
            const isUser = req.user.rol === "user"
            const isPremium = req.user.rol === "premium"

            res.render("profile", { user: userDto, isAdmin: isAdmin, isUser: isUser, isPremium: isPremium })
        } catch (error) {
            res.status(500).json({ message: "Error al cargar la página:", error })
        }

    }

    async current (req, res){
        const user=req.user
        res.send({message:"Usuario encontrado en la request",payload:user})
    }



    async logout(req, res) {

        try {

            if (req.session.login) {
                req.session.destroy()
                return res.redirect("/login")
            }
            res.clearCookie("cookieToken")
            return res.redirect("/login")

        } catch (error) {
            res.status(500).json({ message: "Error al cerrar sesión:", error })
        }

    }

    async getUsers(req, res) {
        const users = await userManager.getUsers()
        res.json(users)
    }

}





module.exports = userController