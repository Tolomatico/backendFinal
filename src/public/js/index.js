const socket = io()

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