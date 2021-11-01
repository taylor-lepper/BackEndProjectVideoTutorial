const mongoose = require("mongoose");
const Course = require("./Course");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	accountCreatedOn: { type: Date, default: Date.now() },
	enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

module.exports = mongoose.model("User", userSchema);
