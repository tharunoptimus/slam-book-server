const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
const { v4: uuidv4 } = require("uuid")
const emailjs = require("@emailjs/nodejs")
const router = express.Router()
const { words } = require("./words.js")
const User = require("../../schemas/UserSchema")
const Registration = require("../../schemas/RegistrationSchema")
const bcrypt = require("bcrypt")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "Registration Endpoint Online" })
})

router.get("/:registerNumber/:sessionSecret", async (req, res) => {
	let { registerNumber, sessionSecret } = req.params
	if (!registerNumber || !sessionSecret)
		return res
			.status(400)
			.send({ message: "Make sure you copy paste the entire URL" })

	let registration = await Registration.findOne({ registerNumber })
	if (!registration)
		return res
			.status(400)
			.send({
				message: `Invalid Request: Signup for ${registerNumber} first`,
			})

	if (registration.sessionSecret !== sessionSecret)
		return res
			.status(400)
			.send({
				message:
					"Invalid Request: Session Secret Mismatch. Signup again!",
			})

	let randomId = uuidv4()
	console.log(`Update ID generated: ${randomId} for ${registerNumber}`)

	try {
		await Registration.updateOne(registerNumber, { updateSecret: randomId })
		res.status(200).send({ updateID: randomId })
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error generating update ID" })
	}
})

router.post("/", async (req, res) => {
	let registerNumber = req.body.registerNumber
	if (!registerNumber)
		return res.status(400).send({ message: "Register Number not provided" })

	let registration = await Registration.findOne({ registerNumber })
	if (registration) {
		let randomId = uuidv4()
		console.log(`Random ID generated: ${randomId} for ${registerNumber}`)
		let status = await sendEmail(registerNumber, randomId)
		if (status) {
			await Registration.updateOne(
				{ registerNumber },
				{ sessionSecret: randomId }
			)
			return res.status(200).send({ message: "Email sent successfully" })
		} else {
			return res.status(500).send({ message: "Error sending email" })
		}
	}

	let randomId = uuidv4()
	console.log(`Random ID generated: ${randomId} for ${registerNumber}`)
	let status = await sendEmail(registerNumber, randomId)
	if (status) {
		await Registration.create({ registerNumber, sessionSecret: randomId })
		return res.status(200).send({ message: "Email sent successfully" })
	} else {
		return res.status(500).send({ message: "Error sending email" })
	}
})

router.post("/confirm", async (req, res) => {
	let { username, registerNumber, updateSecret, password } = req.body

	if (!username || !registerNumber || !updateSecret || !password)
		return res
			.status(400)
			.send({ message: "Make sure the entire payload was sent" })

	let registration = await Registration.findOne({ registerNumber })
	if (!registration)
		return res
			.status(400)
			.send({
				message: `Invalid Request: Signup for ${registerNumber} first`,
			})

	if (registration.updateSecret !== updateSecret)
		return res
			.status(400)
			.send({
				message:
					"Invalid Request: Update Secret Mismatch. Signup again!",
			})

	let user = await User.findOne({username}).catch((error) => {
		console.log(error)
		payload.errorMessage = "Something went wrong!"
		return res.status(500).send("Something went wrong!")
	})

	if (user == null) {
		// No user found
		let data = {
			email: registerNumber + "@student.annauniv.edu",
			username,
			registerNumber,
			profilePic: "https://api.dicebear.com/6.x/open-peeps/svg?backgroundType=gradientLinear,solid&seed=${username}"
		}

		data.password = await bcrypt.hash(password, 10)
		User.create(data).then((user) => {
			console.log(user)
			return res.status(201).send({ message: "User Created", username: user.username })
		})
	} else {
		// User Found

		// if that user has the same register number, it is bogus. give the new user a chance to change the username

		if(user.registerNumber == registerNumber) {
			let data = {
				email: registerNumber + "@student.annauniv.edu",
				username,
				registerNumber,
				profilePic: "https://api.dicebear.com/6.x/open-peeps/svg?backgroundType=gradientLinear,solid&seed=${username}"
			}

			data.password = await bcrypt.hash(password, 10)
			User.create(data).then((user) => {
				console.log(user)
				return res.status(201).send({ message: "User Created", username: user.username })
			})
		} else {
			// User found with same username
			return res.status(400).send({ message: "Username already in use!" })
		}

	}
})

async function sendEmail(registerNumber, randomId) {
	if (registerNumber.length !== 10) return false

	let email = registerNumber + "@student.annauniv.edu"
	let secretWord = randomNameGenerator(2)

	let frontEndURL = process.env.FRONT_END_URL
	let serviceID = process.env.EMAILJS_SERVICE_ID
	let templateID = process.env.EMAILJS_TEMPLATE_ID
	let publicKey = process.env.EMAILJS_PUBLIC_KEY
	let privateKey = process.env.EMAILJS_PRIVATE_KEY

	let verifyURL = frontEndURL + "/verify/" + registerNumber + "/" + randomId

	let templateParams = {
		secretWord,
		registerNumber,
		verifyURL,
		toEmail: email,
		developerName: "Team Angris",
	}

	try {
		let response = await emailjs.send(
			serviceID,
			templateID,
			templateParams,
			{ publicKey, privateKey }
		)
		console.log(response)
		return true
	} catch (error) {
		console.log(error)
		return false
	}
}

function randomNameGenerator(numberOfWords = 1) {
	if (numberOfWords < 1) return false
	let randomName = ""
	for (let i = 0; i < numberOfWords; i++) {
		randomName += words[Math.floor(Math.random() * words.length)]
		if (i !== numberOfWords - 1) {
			randomName += " "
		}
	}
	return randomName
}

module.exports = router
