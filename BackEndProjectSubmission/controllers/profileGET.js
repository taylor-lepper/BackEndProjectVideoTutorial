const User = require("../models/User");
const Course = require("../models/Course");

module.exports = function (req, res) {
	if (res.user) {
		let context = {};
		let username = res.user.username;
		console.log("profile res.user: " + res.user.username);

		User.findOne({ username }).then((user) => {
			console.log(user);

			let enrolledCourses = user.enrolledCourses;
			let courseArray = [];
			let courseNameArray = [];

			enrolledCourses.forEach((id) => {
				Course.findById(id).then((course) => {
					// console.log(course);

					//...date fix trim
					let date = course.createdAt;
					let newDate = new Date(date).toDateString();

					let subCourse = {
						id: course._id,
						title: course.title,
						imgURL: course.imgURL,
						createdAt: newDate,
					};
					let name = " " + course.title;
					courseNameArray.push(name);
					courseArray.push(subCourse);
				});
			});
			context.type = "none";
			context.loggedIn = true;
			context.username = res.user.username;
			context.accountCreatedOn = res.user.accountCreatedOn;
			context.courses = courseArray;
			context.enrolledCourses = courseNameArray;

			res.render("profile", context);
		});
	} else {
		res.cookie("status", {
			type: "warning",
			message: "User not logged in!",
		});
		res.redirect("/");
	}
};
