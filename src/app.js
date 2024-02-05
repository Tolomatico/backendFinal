const express = require("express")
const app = express()
const PUERTO = 8080
const exphbs = require("express-handlebars")
const multer = require("multer")
const socket=require("socket.io")
const mongoose=require("mongoose")


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
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)
app.use(express.static("./src/public"))

const httpServer=app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`)
})

const ProductManager = require("./dao/fs/product-manager")

const manager = new ProductManager("./src/dao/fs/products.json")

 const io= socket(httpServer)

 let messages=[]

 io.on("connection",async (socket)=>{

    console.log("Cliente conectado")
    socket.on("message", (data)=>{
        messages.push(data)
        io.emit("messagesLogs", messages)
     })
     
 
     socket.emit("productos",await manager.getProducts())
     socket.on("eliminarProducto", async (id)=>{
        await manager.deleteProduct(id)
        io.sockets.emit("productos", await manager.getProducts())
     })

     
     socket.on("agregarProducto", async (newProduct)=>{
        await manager.addProduct(newProduct)
        io.sockets.emit("productos", await manager.getProducts())
     })

 })

 mongoose.connect("mongodb+srv://tolo:tolo1239@cluster0.9cp6ccu.mongodb.net/ecommerce?retryWrites=true&w=majority")
 .then(()=>console.log("Conectado a la base de datos"))
 .catch((error)=>console.log(error))



