const configObject = require("../src/config/config.js")
const { base_url } = configObject
const supertest = require("supertest")
const request = supertest(base_url)




describe("Testing app", () => {
    let cart  
    let product 

     describe("Testing Users endpoints", function () {
          let cookie
  
          it("Test User Register", async function () {
  
              const newUser = {
                  first_name: "test",
                  last_name: "test",
                  email: "tester@exam.com",
                  password: "123"
              }
  
              const { _body } = await request.post("/api/users/register").send(newUser)
  
              const { expect } = await import('chai')
  
              expect(_body.payload).to.have.property("_id")
              cart = _body.payload.cart
  
          })
  
          it("Test User Login", async function () {
              const user = {
                  email: "test@gmail.com",
                  password: "123"
              }
              const result = await request.post("/api/users/login").send(user)
              const { expect } = await import('chai');
              const cookieResult = result.headers['set-cookie']['0']
  
              expect(cookieResult).to.be.ok
              cookie = {
                  name: cookieResult.split("=")['0'],
                  value: cookieResult.split("=")['1']
              }
  
  
              expect(cookie.name).to.be.ok.and.eql("cookieToken")
              expect(cookie.value).to.be.ok
  
          })
  
          it("Test User Authenticated", async function () {
  
              const { _body } = await request.get("/api/users/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
              const { expect } = await import('chai')
              expect(_body.payload.email).to.be.eql("test@gmail.com")
  
          })
  
      })
  
  
  
      describe("Test Products endpoints", function () {
  
          it("Test Create Product", async function () {
              const newProduct = {
                  title: "test",
                  description: "test",
                  img: "test",
                  price: 123,
                  status: true,
                  code: 45654,
                  stock: 123,
                  category: "test",
                  owner: "test@gmail.com"
              }
  
              const result = await request.post("/api/products")
                  .field("title", newProduct.title)
                  .field("description", newProduct.description)
                  .field("img", newProduct.img)
                  .field("price", newProduct.price)
                  .field("status", newProduct.status)
                  .field("code", newProduct.code)
                  .field("stock", newProduct.stock)
                  .field("category", newProduct.category)
                  .field("owner", newProduct.owner)
                  .attach("thumbnail", "./test/test.jpg")
  
              const { expect } = await import('chai')
              expect(result.status).to.be.eql(200)
              expect(result._body.payload).to.have.property("_id")
              expect(result._body.payload.thumbnail).to.be.ok
              product=result._body.payload._id
          })
  
      }) 

    describe("Test Cart endpoit", function () {
        it("Add Product to Cart", async function () {

            const cartId = cart
            const productId = product
            const result = await request.post(`/api/carts/${cartId}/product/${productId}`).send({ quantity: 5 })
            const { expect } = await import('chai')
            expect(result.status).to.be.eql(200)
            expect(result.body.status).to.be.eql("success")
            expect(result.body.message).to.be.eql("Se agrego el producto al carrito")


        })
    })




})