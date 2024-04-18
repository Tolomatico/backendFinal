const totalCart=(array)=> array.reduce((acc,item)=>{
    return acc + item.product.totalPrice 

},0)

const generateCode = ()=>{

    const random=Math.random()
    const date=Date.now()
    return parseInt(random + date)

}
const totalAmount=(array)=>array.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity)
}, 0)

module.exports={totalCart,generateCode,totalAmount}