require("express-async-errors")
const User = require("./schemas/UserSchema")

exports.cors = (req, res, next) => {
	let origin = req.headers.origin
	origin !== undefined
		? res.setHeader("Access-Control-Allow-Origin", origin)
		: ""

	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE",
		"OPTIONS"
	)
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	res.setHeader("Access-Control-Allow-Credentials", true)
	res.setHeader("Vary", "Origin")
	return next()
}

exports.requireLogin = async (req, res, next) => {
	let { username, temporaryToken } = req.body

	if (!username || !temporaryToken) {
		return res
			.status(400)
			.json({ message: "Make sure to enter all the details (M)" })
	}

	let user = await User.findOne({ username }).catch((error) => {
		console.log(error)
		return res.status(500).json({ message: "Something went wrong (M)" })
	})

	if (!user) {
		return res.status(404).json({ message: "User not found (M)" })
	}

	if (user.temporaryToken !== temporaryToken) {
		return res.status(401).json({ message: "Invalid temporary token (M)" })
	}

	return next()
}
