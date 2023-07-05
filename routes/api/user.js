const express = require("express")
const app = express()
const router = express.Router()
const User = require("../../schemas/UserSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.status(200).render("USER API ONLINE")
})

router.get("/:searchTerm", async (req, res) => {
	let { searchTerm } = req.params

	try {
		let users = await User.find({
			$or: [
				{ firstName: { $regex: searchTerm, $options: "i" } },
				{ lastName: { $regex: searchTerm, $options: "i" } },
				{ username: { $regex: searchTerm, $options: "i" } },
				{ email: { $regex: searchTerm, $options: "i" } },
				{ registerNumber: { $regex: searchTerm, $options: "i" } },
			],
		})
			.populate({
				path: [
					"_id",
					"registerNumber",
					"firstName",
					"lastName",
					"username",
					"email",
					"profilePic",
				],
			})
			.catch((e) => {
				console.log(e)
				return res.status(500).send("Internal server error")
			})

		return res.status(200).json({ users })
	} catch (e) {
		console.log(e)
		return res.status(500).send("Internal server error")
	}
})

module.exports = router
