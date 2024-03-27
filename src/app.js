        /// Importación de dependencias ///

const express = require("express")
const app = express()
const PUERTO = 8080
const exphbs = require("express-handlebars")
const multer = require("multer")
const socket = require("socket.io")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const FileStore = require("session-file-store")
const fileStore = FileStore(session)
const MongoStore = require("connect-mongo")
const passport=require("passport")
const initilizePassport=require("./config/passport.config.js")
const configObject=require("./config/config.js")
const {mongo_url,secretKey}=configObject
const cors=require("cors")

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


app.use(session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: mongo_url
    })
}))
initilizePassport()
app.use(passport.initialize())
app.use(passport.session()) 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/users", usersRouter)
app.use("/api/sessions", sessionRouter)
app.use("/", viewsRouter)
app.use(express.static("./src/public"))
app.use(cookieParser())
app.use(cors())


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}/products`)
})


const ProductManager = require("./dao/db/product-manager-db.js")
const manager = new ProductManager()
const messagesModel = require("./models/messages.model.js")
const io = socket(httpServer)

io.on("connection", async (socket) => {

    socket.on("message", async (data) => {

        await messagesModel.create(data)

        const messages = await messagesModel.find()

        io.emit("messagesLogs", messages)
    })


    socket.emit("productos", await manager.getProducts())
    socket.on("eliminarProducto", async (id) => {
        await manager.deleteProduct(id)
        io.sockets.emit("productos", await manager.getProducts())
    })


    socket.on("agregarProducto", async (newProduct) => {
        await manager.addProduct(newProduct)
        io.sockets.emit("productos", await manager.getProducts())
    })

})

//  Conexion a MONGO DB //}

require("./database.js")



