const express = require("express")
const app = express()
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const User = require("../../schemas/UserSchema")
const Adjective = require("../../schemas/AdjectiveSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.status(200).render("ADJECTIVE API ONLINE")
})


module.exports = router
