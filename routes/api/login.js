require("dotenv").config()
const express = require("express")
const app = express()
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../../schemas/UserSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (req, res) => {
	res.status(200).render("LOGIN API ONLINE")
})

router.post("/", async (req, res) => {
	if (req.body.username && req.body.password) {
		let user = await User.findOne({ username: req.body.username })
			.populate({
				path: [
					"_id",
					"registerNumber",
					"firstName",
					"lastName",
					"instagram",
					"twitter",
					"facebook",
					"linkedIn",
					"website",
					"about",
					"emoji",
					"email",
					"profilePic",
					"profilePicBinary",
				],
			})
			.catch((error) => {
				console.log(error)
				return res.status(500).send("Something went wrong!")
			})

		if (user != null) {
			let result = await bcrypt.compare(req.body.password, user.password)

			if (result === true) {
				
				let token = jwt.sign(
					{ username: user.username },
					process.env.JWT_SECRET,
					{ expiresIn: process.env.JWT_VALIDITY }
				)
				user.temporaryToken = token

				return res.status(200).send({ user })
			}
		}

		return res.status(400).send("Invalid credentials")
	}

	res.status(400).send("Make sure to enter all the details!")
})

module.exports = router
