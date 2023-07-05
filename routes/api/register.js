const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
const { v4: uuidv4 } = require("uuid")
const emailjs = require("@emailjs/nodejs")
const router = express.Router()
const { words } = require("./words.js")
const User = require("../../schemas/UserSchema")
const Registration = require("../../schemas/RegistrationSchema")
const bcrypt = require("bcrypt")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "Registration Endpoint Online" })
})


module.exports = router
