const socket = io()

socket.on("productos", (data) => {

    renderProducts(data)
})

function denied() {

    Swal.fire({
        title: "No puedes eliminar este producto.",
        icon: "error"
       
    })
}

function success() {

    Swal.fire({
        title: "Producto eliminado.",
        icon: "success"
       
    })
}

const rol = document.getElementById("rol").textContent
const email = document.getElementById("email").textContent

const renderProducts = (productos) => {

    const div = document.getElementById("productsRealTime")
    div.innerHTML = ""

    productos.forEach(element => {
        if (element.status === true) {
            const productCard = document.createElement("div")
            productCard.classList.add("card")
            productCard.innerHTML = `
                <img class="img" src='${element.thumbnail[0]}'/> 
                <p>Id :${element._id}</p>
                <p>${element.title}</p>
                <p>Precio:$${element.price}</p>
                <button class="eliminarProducto border-2 rounded-xl border-red-700 bg-red-700 text-white p-1 mt-5">Eliminar producto</button>
                `
            div.appendChild(productCard)

            productCard.querySelector("button").addEventListener("click", () => {


                if (rol === "admin") {
                    eliminarProducto(element._id)
                    success()   

                } else if (email === element.owner) {
                    eliminarProducto(element._id)
                    success()


                } else denied()

            })

        }

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
        category: document.getElementById("category").value,
        img: document.getElementById("img").value,
        owner: document.getElementById("owner").value

    }




    socket.emit("agregarProducto", newProduct)

}
