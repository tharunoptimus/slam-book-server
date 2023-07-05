const express = require("express")
const app = express()
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const User = require("../../schemas/UserSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (req, res) => {
	res.status(200).render("LOGOUT API ONLINE")
})

router.post("/", async (req, res) => {
	let username = req.body.username
	let temporaryToken = req.body.temporaryToken

	if (username && temporaryToken) {
		let user = await User.findOne({ username: username }).catch((error) => {
			console.log(error)
			return res.status(500).send("Something went wrong!")
		})

		if (user == null) {
			return res.status(400).send("Invalid credentials")
		}

		if (user.temporaryToken === temporaryToken) {
			let random = uuidv4()

			await User.updateOne(
				{ username: username },
				{ temporaryToken: random }
			).catch((error) => {
				console.log(error)
				return res.status(500).send("Something went wrong!")
			})

			return res.status(200).send("Logged out successfully!")
		} else {
			return res.status(400).send("Invalid credentials")
		}
	}
	return res.status(400).send("Make sure to enter all the details!")
})

module.exports = router
