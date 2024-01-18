const express = require("express")
const app = express()
const PUERTO = 8080
const exphbs = require("express-handlebars")
const multer = require("multer")
const socket=require("socket.io")


app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/img")},
    filename: (req, file, cb) => {
        cb(null, file.originalname)}
})

const upload = multer({ storage})

app.post("/upload",upload.single("img"),(req,res)=>{
    res.send("Subido con exito")
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/", productsRouter)
app.use("/api/", cartsRouter)
app.use("/", viewsRouter)
app.use(express.static("./src/public"))

const httpServer=app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`)
})

const io=socket(httpServer)

io.on("connection",(socket)=>{
    console.log("Cliente conectado")
    socket.on("message",(data)=>{
        console.log(data)
        io.sockets.emit("message",data)
    })

    socket.emit("saludos","Hola como estas cliente")
})
