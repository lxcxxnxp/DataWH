require("dotenv").config()

module.exports = {

    jwtSign : process.env.SECRET_TOKEN,
    URI_connection: process.env.DB_CONNECTION
}