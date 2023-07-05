const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    profilePic: { type: String },
	givenAdjectives: [{ type: Schema.Types.ObjectId, ref: "Adjective" }],
	receivedAdjectives: [{ type: Schema.Types.ObjectId, ref: "Adjective" }],
	email: { type: String, required: true, trim: true, unique: true },
	password: { type: String, required: true, trim: true },
	username: { type: String, trim: true, unique: true },
	registerNumber: { type: String, required: true, trim: true, unique: true },
	firstName: { type: String, trim: true },
	lastName: { type: String, trim: true },
	instagram: { type: String, trim: true },
	twitter: { type: String, trim: true },
	facebook: { type: String, trim: true },
	linkedIn: { type: String, trim: true },
	website: { type: String, trim: true },
	about: { type: String, trim: true },
	emoji: { type: String, trim: true },
	temporaryToken: { type: String, trim: true },
}, { timestamps: true });

let User = mongoose.model('User', UserSchema)
module.exports = User;