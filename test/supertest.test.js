const configObject=require("../src/config/config.js")
const {base_url}=configObject
const supertest = require("supertest")
const request = supertest(base_url)


describe("Testing app", () => {
    describe("Testing Users endpoints", function () {
        let cookie

        it("Test User Register", async function () {

            const newUser = {
                first_name: "test",
                last_name: "test",
                email: "test@gmail.com",
                password: "123"
            }

            const { _body } = await request.post("/api/users/register").send(newUser)

            const { expect } = await import('chai')

            expect(_body.payload).to.have.property("_id")

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
})