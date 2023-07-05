const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
require('express-async-errors')
const app = express()
require("./database")
const { cors, requireLogin } = require("./middleware")
const port = process.env.PORT || 4003

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
const registerAPI = require("./routes/api/register")
const loginAPI = require("./routes/api/login")
const logoutAPI = require("./routes/api/logout")

app.use("/api/register", cors, registerAPI)
app.use("/api/login", cors, loginAPI)
app.use("/api/logout", cors, logoutAPI)

app.get("/", (_, res) => {
	res.status(200).send("SLAM BOOK API ONLINE")
})