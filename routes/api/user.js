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

router.post("/:username", async (req, res) => {
	let { requestedUsername } = req.params
	let { username } = req.body

	try {
		if (username === requestedUsername) {
			let requestedUser = await User.findOne({
				username: requestedUsername,
			})
				.populate({
					path: "receivedAdjectives",
					populate: { path: "content" },
				})
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
					],
				})
				.catch((e) => {
					console.log(e)
					return res.status(500).send("Internal server error")
				})

			if (!requestedUser) return res.status(404).send("User not found")

			return res.status(200).json({ user: requestedUser })
		}
	} catch (e) {
		console.log(e)
		return res.status(500).send("Internal server error")
	}

	try {
		let requestedUser = await User.findOne({ username: requestedUsername })
			.populate({
				path: "receivedAdjectives",
				populate: { path: ["givenBy", "receivedBy", "content"] },
			})
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
				],
			})
			.catch((e) => {
				console.log(e)
				return res.status(500).send("Internal server error")
			})

		if (!requestedUser) return res.status(404).send("User not found")

		requestedUser.receivedAdjectives =
			requestedUser.receivedAdjectives.filter(
				(adjective) => adjective.givenBy.username === username
			)

		return res.status(200).json({ user: requestedUser })
	} catch (error) {
		console.log(error)
		return res.status(500).send("Internal server error")
	}
})

router.put("/:username", async (req, res) => {
	let { username } = req.params

	let stuffThatCanBeUpdated = [
		"firstName",
		"lastName",
		"instagram",
		"twitter",
		"facebook",
		"linkedIn",
		"website",
		"about",
		"emoji",
	]

	let userNameToBeUpdated = req.body.username

	if (username !== userNameToBeUpdated)
		return res
			.status(403)
			.send("You are not allowed to change your username")

	let stuffToUpdate = {}

	for (let key in req.body) {
		if (stuffThatCanBeUpdated.includes(key)) {
			stuffToUpdate[key] = req.body[key]
		}
	}

	try {
		let updatedUser = await User.findOneAndUpdate(
			{ username: username },
			{ $set: stuffToUpdate },
			{ new: true }
		)
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
				],
			})
			.catch((e) => {
				console.log(e)
				return res.status(500).send("Internal server error")
			})

		if (!updatedUser) return res.status(404).send("User not found")

		return res.status(200).json({ user: updatedUser })
	} catch (e) {
		console.log(e)
		return res.status(500).send("Internal server error")
	}
})

module.exports = router
