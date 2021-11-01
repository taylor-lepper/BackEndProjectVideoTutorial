const mongoose = require("mongoose");
const User = require("./User");

const courseSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	description: { type: String, required: true, minlength: 20 },
	imgURL: { type: String, required: true },
	isPublic: { type: Boolean, default: true, required: true },
	createdAt: { type: Date, default: Date.now() },
	usersEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

module.exports = mongoose.model("Course", courseSchema);
