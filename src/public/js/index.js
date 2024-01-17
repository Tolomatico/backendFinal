const socket= io()
socket.emit("message","Conectado")

socket.on("saludos",(data)=>{
    console.log(data)
})