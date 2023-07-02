const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()
require("./database")
const { cors } = require("./middleware")
const port = process.env.PORT || 4003

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
const registerAPI = require("./routes/api/register")

app.use("/api/register", cors, registerAPI)

app.get("/", (_, res) => {
	res.status(200).send("SLAM BOOK API ONLINE")
})