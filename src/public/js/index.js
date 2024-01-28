const socket = io()

let user;
const chatBox=document.getElementById("chatBox")

chatBox.addEventListener("keyup",(event)=>{
    if(event.key === "Enter"){
        if(chatBox.value.trim().length > 0){

            socket.emit("message",{user:user,message:chatBox.value})
            chatBox.value=""
        }
    }
   
})
socket.on("messagesLogs", (data)=>{
   
        const pLogs =document.getElementById("messagesLogs")
        let messages=""
        
        data.forEach(message =>{
            messages= messages + `${message.user} dice:${message.message}<br>`    
        })
        pLogs.innerHTML=messages
})



Swal.fire({
    title:"Identificación",
    input:"text",
    text:"Ingresar mail",
   inputValidator:(value)=>{
       return !value && "Ingresa tu mail para continuar"
   },
   allowOutsideClick:false

}).then((result) => {
        user=result.value
        console.log(user)

    {
      Swal.fire({

        title: `Bienvenido ${result.value}`,
       
      });
    }
  })


socket.on("productos", (data) => {
    console.log(data)
    renderProducts(data)
})

const renderProducts =  (productos) => {

    const div = document.getElementById("productsRealTime")
        div.innerHTML = ""

        productos.forEach(element => {
    
            const productCard = document.createElement("div")
            productCard.classList.add("card")
            productCard.innerHTML = `
            <img class="img" src="sin imagen"/> 
            <p>Id :${element.id}</p>
            <p>${element.title}</p>
            <p>Precio:$${element.price}</p>
            <button class="eliminarProducto">Eliminar producto</button>
            `
            div.appendChild(productCard)
    
            productCard.querySelector("button").addEventListener("click", () => {
                eliminarProducto(element.id)
    
            })
        })

    
    
}

const eliminarProducto = (id) => {

    socket.emit("eliminarProducto", id)
}

const btnSend = document.getElementById("btnSend")

   btnSend.addEventListener("click", () => {
    
        agregarProducto()
    
    })

   
const agregarProducto = () => {
    const newProduct = {

        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("img").value,
        status: document.getElementById("status").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value

    }
    console.log(newProduct)

    socket.emit("agregarProducto", newProduct)

}

const newProduct = {

    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("img").value,
    status: document.getElementById("status").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value

}


 