const express = require("express")
const app = express()
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")
const User = require("../../schemas/UserSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (req, res,) => {
	res.status(200).render("LOGIN API ONLINE")
})

router.post("/", async (req, res,) => {
	if (req.body.username && req.body.password) {
		let user = await User.findOne({ username: req.body.username }).catch(
			(error) => {
				console.log(error)
				return res.status(500).send("Something went wrong!")
			}
		)

		if (user != null) {
			var result = await bcrypt.compare(req.body.password, user.password)

			if (result === true) {
				let randomId = uuidv4()
				console.log(
					`Session ID generated: ${randomId} for ${user.username}`
				)

				await User.updateOne(
					{ username: user.username },
					{ temporaryToken: randomId }
				).catch((error) => {
					console.log(error)
					return res.status(500).send("Something went wrong!")
				})

				return res.status(200).send({ temporaryToken: randomId })
			}
		}

		return res.status(400).send("Invalid credentials")
	}

	res.status(400).send("Make sure to enter all the details!")
})

module.exports = router
