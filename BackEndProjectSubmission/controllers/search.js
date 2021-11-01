const Course = require("../models/Course");

module.exports = function (req, res) {
	let input = req.body.search.toLowerCase();
	console.log(input);

	if (res.user) {
		let context = {};
		context.type = "none";
		context.loggedIn = true;
		context.username = res.user.username;

		Course.find({}).then((courses) => {
			// console.log("courses homeGET loggedIn: " + courses);
			let courseArray = [];

			courses.forEach((course) => {
				//...date fix
				let courseName = course.title.toLowerCase();

				if (courseName.includes(input)) {
					let date = course.createdAt;
					let newDate = new Date(date).toDateString();

					let subCourse = {
						id: course._id,
						title: course.title,
						description: course.description,
						imgURL: course.imgURL,
						createdAt: newDate,
						isPublic: course.isPublic,
					};
					courseArray.push(subCourse);
				}
			});

			context.courses = courseArray;

			res.render("search", context);
		});
	} else {
		res.cookie("status", {
			type: "warning",
			message: "User not logged in!",
		});
		res.redirect("/");
	}
};
