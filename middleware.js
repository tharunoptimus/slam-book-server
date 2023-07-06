require("express-async-errors")
const jwt = require('jsonwebtoken')

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

	if (req.headers.authorization) {
		let token = req.headers.authorization.split(" ")[1]
		let user = jwt.verify(token, process.env.JWT_SECRET)
		req.body.username = user.username

		return next()
	}

	return res.status(401).json({ message: "Unauthorized (M)" })
}
