class UserDTO {
    constructor(firstName, lastName,email, rol,cart) {
        this.first_name = firstName,
            this.last_name = lastName,
            this.email = email,
            this.rol = rol,
            this.cart=cart
    }
}

module.exports = UserDTO