const express = require("express")
const app = express()
const router = express.Router()
const User = require("../../schemas/UserSchema")
const Adjective = require("../../schemas/AdjectiveSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.status(200).render("ADJECTIVE API ONLINE")
})

router.put("/submit/:username/:content", async (req, res) => {
	let username = req.params.username
	let content = req.params.content

	if (!username || !content) {
		return res.status(400).send("Make sure to enter all the details!")
	}

	let signedInUser = req.body.username

	if (signedInUser == username) {
		return res
			.status(400)
			.send("You can't submit an adjective for yourself!")
	}

	let user = await User.findOne({ username: username }).catch((error) => {
		console.log(error)
		return res.status(500).send("Something went wrong!")
	})

	if (user == null) {
		return res.status(400).send("Invalid credentials")
	}

	let adjective = await Adjective.findOne({
		givenBy: signedInUser,
		givenTo: username,
	})
		.populate({
			path: ["_id", "givenBy", "givenTo", "content"],
		})
		.catch((error) => {
			console.log(error)
			return res.status(500).send("Something went wrong!")
		})

	if (adjective != null) {
		await Adjective.updateOne(
			{ givenBy: signedInUser, givenTo: username },
			{ content: content }
		).catch((error) => {
			console.log(error)
			return res.status(500).send("Something went wrong!")
		})

		return res.status(200).send("Adjective updated successfully!")
	}

	let newAdjective = await Adjective.create({
		content: content,
		givenBy: signedInUser,
		givenTo: username,
	}).catch((error) => {
		console.log(error)
		return res.status(500).send("Something went wrong!")
	})

	try {
		await User.updateOne(
			{ username: signedInUser },
			{ $push: { givenAdjectives: newAdjective._id } }
		)
		await User.updateOne(
			{ username: username },
			{ $push: { receivedAdjectives: newAdjective._id } }
		)
	} catch (error) {
		console.log(error)
		await Adjective.deleteOne({ _id: newAdjective._id })
		return res.status(500).send("Unable to update user's adjectives!")
	}

	return res.status(200).send("Adjective submitted successfully!")
})

module.exports = router
