/// Importación de dependencias ///

const express = require("express")
const app = express()
const PUERTO = 8080
const exphbs = require("express-handlebars")
const multer = require("multer")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const passport = require("passport")
const initilizePassport = require("./config/passport.config.js")
const cors = require("cors")
const authMiddleware = require("./middleware/authmiddleware.js")
const compression=require("express-compression")
const addLogger=require("./utils/logger.js")
const {cpus}=require("os")
const cpu=cpus().length
const swaggerJSDoc=require("swagger-jsdoc")
const swaggerUIExpress=require("swagger-ui-express")


///  Conexion a MONGO DB ///

require("./database.js")


/// Configuración Handlebars ///

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

/// Importación de rutas ///

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")
const usersRouter = require("./routes/users.router")
const sessionRouter = require("./routes/session.router.js")
const socketService = require("./socket/socket.js")

/// Configuración de Multer ///
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/img")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })
app.post("/upload", upload.single("img"), (req, res) => {
    res.send("Subido con exito")
})



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
app.use(cors())
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


