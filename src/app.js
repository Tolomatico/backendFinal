/// Importación de dependencias ///

const express = require("express")
const app = express()
const configObject= require("./config/config.js")
const PUERTO=configObject.puerto
const front_url=configObject.front_url
const cookieParser = require("cookie-parser")
const session = require('express-session')
const passport = require("passport")
const initilizePassport = require("./config/passport.config.js")
const cors = require("cors")
const authMiddleware = require("./middleware/authmiddleware.js")
const compression=require("express-compression")
const addLogger=require("./utils/logger.js")
const swaggerJSDoc=require("swagger-jsdoc")
const swaggerUIExpress=require("swagger-ui-express")


///  Conexion a MONGO DB ///

require("./database.js")

/// Importación de rutas ///

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")
const usersRouter = require("./routes/users.router")
const sessionRouter = require("./routes/session.router.js")
const socketService = require("./socket/socket.js")

const corsOptions = {
    origin: ['http://localhost:5173',front_url], 
    credentials: true,
    optionsSuccessStatus: 200
}

///  AuthMiddleware  ///
initilizePassport()
app.use(session({
    secret: 'tu_clave_secreta',
    resave: false,
    saveUninitialized: false
  }))
app.use(addLogger)
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(authMiddleware)
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))
app.use(compression())
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/users", usersRouter)
app.use("/api/sessions", sessionRouter)
app.use("/", viewsRouter)



const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`)
})

socketService(httpServer)


const swaggerOptions={
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Documentación app Ecommerce",
            description:"App de venta de articulos online."
        }
    },
    apis:["./src/docs/**/*.yaml"],
}

const specs=swaggerJSDoc(swaggerOptions)
app.use("/apidocs",swaggerUIExpress.serve,swaggerUIExpress.setup(specs))


