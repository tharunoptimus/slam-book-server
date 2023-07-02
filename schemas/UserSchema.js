const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
	name: { type: String, required: true, trim: true },
    profilePic: { type: String },
	givenAdjectives: [{ type: Schema.Types.ObjectId, ref: "Adjective" }],
	receivedAdjectives: [{ type: Schema.Types.ObjectId, ref: "Adjective" }],
	email: { type: String, required: true, trim: true, unique: true },
	password: { type: String, required: true, trim: true },
	username: { type: String, trim: true, unique: true },
	rollNumber: { type: String, required: true, trim: true, unique: true },
}, { timestamps: true });

let User = mongoose.model('User', UserSchema)
module.exports = User;