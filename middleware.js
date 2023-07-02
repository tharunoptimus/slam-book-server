exports.cors = (req, res, next) => {
	let allowedOrigins = [
		"http://localhost:3003",
		"http://localhost:3000"
	]
	
	if (allowedOrigins.includes(origin)) {
	} else
	console.log({
		origin,
		message: "Origin not allowed",
		status: "nope",
		method: req.method,
	})
	
	let origin = req.headers.origin
	origin !== "" ? res.setHeader("Access-Control-Allow-Origin", origin): ""

	
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