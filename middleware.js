exports.cors = (req, res, next) => {

	let origin = req.headers.origin
	origin !== undefined ? res.setHeader("Access-Control-Allow-Origin", origin): ""

	
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