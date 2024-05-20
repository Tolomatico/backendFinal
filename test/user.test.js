const assert = require("assert")
const UserManager = require("../src/dao/db/user-manager-db.js")

require("../src/database.js")

describe("test dao Users", function () {

    before(function () {
        this.userDao = new UserManager()
    })

    it("Get all users", async function () {
        const result = await this.userDao.getUsers()
        assert.strictEqual(Array.isArray(result), true)
    })

    it("Add User to DB",async function(){
        let user={
            first_name:"Tomas",
            last_name:"Ballesty",
            email:"tolomagnaniumo@gmail.com",
            password:"123"
        }
        const result=await this.userDao.save(user)
        assert.ok(result._id)
    })

})

