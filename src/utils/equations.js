const totalCart=(array)=> array.reduce((acc,item)=>{
    return acc + item.product.totalPrice 

},0)

module.exports=totalCart