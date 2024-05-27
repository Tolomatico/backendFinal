const assert = require("assert")
const UserManager = require("../src/dao/db/user-manager-db.js")
const mongoose=require("mongoose")
require("../src/database.js")

describe("test dao Users", function () {

    before(function () {
        this.userDao = new UserManager()
    })

    beforeEach(async function(){
       await mongoose.connection.collections.users.drop()
        
    })

    it("Get all users", async function () {
        const result = await this.userDao.getUsers()
        assert.strictEqual(Array.isArray(result), true)
    })

    it("Add User to DB",async function(){
        let user={
            first_name:"Tomas",
            last_name:"Ballesty",
            email:"asdasd@gmail.com",
            password:"123"
        }
        const result=await this.userDao.save(user)
        assert.ok(result._id)
    })

    it("Get 1 user",async function(){
        let newUser={
            first_name:"Tomas",
            last_name:"Ballesty",
            email:"asd@gmail.com",
            password:"123"
        }
        const user=await this.userDao.save(newUser)
        
        const result=await this.userDao.getUser(user.email)
       
        
        assert.strictEqual(typeof result,"object")
        assert.strictEqual(result.email, user.email)
    }
    )

    after(async function(){
       await mongoose.disconnect()
    })

})

