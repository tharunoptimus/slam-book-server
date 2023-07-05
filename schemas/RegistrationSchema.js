const mongoose = require("mongoose")
const Schema = mongoose.Schema
const RegistrationSchema = new Schema({
	registerNumber: { type: String, required: true, trim: true, unique: true },
	sessionSecret: { type: String, required: true, trim: true },
	updateSecret: { type: String, trim: true },
},{ timestamps: true })

let Registration = mongoose.model("Registration", RegistrationSchema)
module.exports = Registration
