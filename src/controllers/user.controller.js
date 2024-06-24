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
const configObject=require("../config/config.js")
const front_url=configObject.front_url





class userController {

    async deleteUser(req,res){
        const {id}=req.params
        console.log(id)
        try {
            await userManager.delete(id)

            res.status(200).json({status:"success",message:"Usuario Eliminado"})
        } catch (error) {
            res.status(404).json({status:"error",error:"No hemos podido eliminarlo"})
        }   
    }

    async uploadDocuments(req, res) {
        const id = req.params.id
        const uploadedDocuments = req.files



        try {
            const user = await userManager.getUserById(id)
            if (!user) {
                return res.json({ status: "error", message: "No existe el usuario con ese id" })
            }
          
            if (uploadedDocuments) {

                if (uploadedDocuments.profile) {
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
                if (uploadedDocuments.document) {
                    user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
                if (uploadedDocuments.products) {
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
            }

            await user.save()


            res.json({ status: "success",message:"Se han subido los documentos exitosamente" })


        } catch (error) {
            res.json({ status: "error",error:"No se han podido subir los documentos" })
        }


    }

    async changeRole(req, res) {
        const id = req.params.uid

        try {
            const user = await usersModel.findById(id)

            if (!user) return response(res, 401, "El usuario no existe.")

            const newRol = user.rol === "user" ? "premium" : "user"

            await usersModel.findByIdAndUpdate(id, { rol: newRol }, { new: true })

           res.status(200).json({status:"success",message:`El usuario cambio su rol a ${newRol}`,payload:newRol})


        } catch (error) {
            res.status(400).json({status:"error",error:"Error al querer cambiar de rol"} )
        }


    }

    async recover(req, res) {
        const { email } = req.body
       
        try {

            if (!verifyEmail(email)) {
                return res.json({ status: "error", error: "Ingrese un email válido" })
            }
            const user = await userManager.getUser(email)
            if (!user) {
                return res.json({ status: "error", error: "No existe un usuario con ese email" })
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

                    <a href="https://cerulean-khapse-58b93b.netlify.app/recoverpassword">Recuperar password</a></p>
                `
            })

            return res.cookie("cookieToken",
                tokenRecover,
                {
                    maxAge: 60000,
                    httpOnly: true
                }).json({ status: "success", message: "Hemos enviado un email ah:", payload: email })

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

                return res.json({status:"error",error:"El tiempo para restablecer el password ah caducado"})
                 
            } else {

                return res.json({status:"success",message:"Cambia tu password"})
                 
            }
        } else {
            return res.json({status:"error",error:"No se ah encontrado la cookie"})
        }



    }

    async recoverPassword(req, res) {

        const { password, repited, token } = req.body
     
        try {
            const user = await userManager.getUserByToken(token)

            if (!user) {
                return res.json({ status: "error", error: "Token inválido" })
            }

            if (user) {

                const repitedPasswords = bcrypt.compareSync(password, user.password)
                if (password.length < 6) {
                    return res.json({ status: "error", error: "El password debe tener al menos 6 caracteres" })
                }
                if (password !== repited) {
                    return res.json({ status: "error", error: "Los passwords deben coincidir" })
                }

                if (repitedPasswords) {
                    return res.json({ status: "error", error: "El password debe ser distinto al anterior" })
                }

                user.password = createHash(password)
                user.token = ""
                await user.save()

                res.json({ status: "success", message: "Listo, ya puedes loguearte con tu nuevo password" })
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
                return res.json({ status: 404, error: "Ya existe un usuario con ese email" })
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



            res.json({ status: 201, message: "Usuario registrado correctamente", payload: newUser })



        } catch (error) {
            return res.json({ status: 404, error: "Credenciales invalidas" })
        }
    }


    async login(req, res) {
        const { email, password } = req.body
     
        try {
            if (!verifyEmail(email)) {
                return res.json({ status: 404, error: "Ingrese un email válido." })
            }

            const user = await userManager.getUser(email)
            if (!user) {
                return res.json({ status: 404, error: "No existe un usuario con ese email." })
            }

            if (!isValidPassword(password, user)) {
                return res.json({ status: 404, error: "El password es incorrecto" })
            }
            
            const userDto = new UserDTO(
                user.first_name,
                user.last_name,
                user.email,
                user.rol,
                user.cart,
                user._id
            )
            user.last_connection = new Date()
            user.save()
            req.logger.info(`El usuario ${user._id} ah iniciado sesión`)
           

            const token = generateToken({ user: user })

          
            res.cookie("cookieToken",
                token,
                {
                    maxAge: 3600000,
                    httpOnly: true
                }).json({ status: 200, message: "Logueado correctamente", payload: token, user: userDto })


        } catch (error) {

            req.logger.warn("Error interno del servidor.")
            res.json(error)
        }

    }

    async profile(req, res) {

        try {

            if (!req.user) {

                return res.status(404).json({ error: "Usuario no encontrado" })
            }


            res.json(req.user)
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" })
        }

    }

    async current(req, res) {
        const user = req.user
        res.send({ message: "Usuario encontrado en la request", payload: user })
    }



    async logout(req, res) {
       
        try {

            const user= await userManager.getUser(req.user.email)
            user.last_connection= new Date()
           user.save
           req.logger.info(`El usuario ${user._id} ah finalizado su sesión`)
          
            res.clearCookie("cookieToken")
            return res.json({ status: 200, message: "Sesión finalizada" })
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