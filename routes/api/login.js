const express = require("express")
const app = express()
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")
const User = require("../schemas/UserSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (req, res,) => {
	res.status(200).render("LOGIN API ONLINE")
})


module.exports = router
