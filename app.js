const ProductManager = require("./product-manager")

const manager = new ProductManager("./products.json")

const PUERTO = 8080

const express = require("express")

const app = express()



app.get("/products/:id", async (req, res) => {
    let id = parseInt(req.params.id);

  const productSearchedById= await manager.getProductById(id)

    if(productSearchedById){ 
        res.send(productSearchedById)
    }else{
        res.send({error:"producto no existe"})
    }
  
 })

app.get("/products",async (req,res)=>{
    let limit=parseInt(req.query.limit)

    const products = await manager.getProducts()

   if(limit){
    const productsLimit= await products.slice(0,limit)
    res.send(productsLimit)
   }else{
    res.send(products)
   }

})

















app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`)
})
