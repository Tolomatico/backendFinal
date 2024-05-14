const {faker} = require("@faker-js/faker")

const generateProducts=()=>{

    return {
        
        title:faker.commerce.productName(),
        description:faker.commerce.productDescription(),
        price:faker.commerce.price(),
        img:faker.commerce.productDescription(),
        thumbnail:faker.image.url(),
        code:faker.string.alphanumeric(8),
        stock:parseInt(faker.string.numeric()),
        status:faker.datatype.boolean(),
        category:faker.commerce.productMaterial(),
        owner:"admin",
        

    }
}

module.exports=generateProducts