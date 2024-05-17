const socket = require("socket.io")
const ProductManager = require("../dao/db/product-manager-db.js")
const manager = new ProductManager()
const messagesModel = require("../models/messages.model.js")


function socketService(httpServer){

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
}

module.exports=socketService