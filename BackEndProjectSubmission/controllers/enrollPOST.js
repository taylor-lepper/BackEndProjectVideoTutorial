const User = require("../models/User");
const Course = require("../models/Course");

module.exports = function (req, res) {
	let courseID = req.params.id;
	console.log(courseID);

	let user = res.user;
	let username = user.username;
	let userID = user.id;
	let context = {};

	if (user) {
		context.loggedIn = true;
		context.username = user.username;
		context.id = user.id;
		context.accountCreatedOn = user.accountCreatedOn;
		context.enrolledCourses = user.enrolledCourses;
		console.log(`username enrollPOST: ${username}`);
	}

	Course.findById(courseID)
		.then((course) => {
			console.log("course to enroll found by id: " + course);
			let courseName = course.title;
			console.log("courseName enroll: " + courseName);
			course.usersEnrolled.push(userID);
			course.save();
			User.findById(userID).then((userFound) => {
				console.log(userFound);
				userFound.enrolledCourses.push(courseID);
				userFound.save();
				res.redirect("/");
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
