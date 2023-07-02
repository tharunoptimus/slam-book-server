const mongoose = require("mongoose")
const Schema = mongoose.Schema
const AdjectiveSchema = new Schema({
	content: { type: String, required: true, trim: true },
	givenBy: { type: Schema.Types.ObjectId, ref: "User" },
	givenTo: { type: Schema.Types.ObjectId, ref: "User" },
},{ timestamps: true })

let Adjective = mongoose.model("Adjective", AdjectiveSchema)
module.exports = Adjective
