const User = require("../models/User");
const Course = require("../models/Course");

module.exports = function (req, res) {
	console.log("Creating a Course!!");
	let context = {};
	let user = res.user;
	if (user) {
		context.loggedIn = true;
		context.username = res.user.username;
		context.accountCreatedOn = res.user.accountCreatedOn;
		context.enrolledCourses = res.user.enrolledCourses;
		console.log(`user.username createPOST: ${user.username}`);
	}
	// console.log(req.body);

	let fields = req.body;

	console.log(fields);

	//isPublic?
	let isPublicOption = false;

	if (fields.isPublic !== "") {
		isPublicOption = true;
	}
	// console.log(isPublicOption);

	//date creation
	let dateVar = fields.courseCreatedOn;
	dateVar = dateVar.split("T")[0];

	// console.log(dateVar);

	//...check title
	if (fields.title.length < 4 || /[^a-zA-Z 0-9\.]/g.test(fields.title)) {
		// res.cookie("status", {
		// 	type: "error",
		// 	message:
		// 		"please enter a valid title (no special characters and at least 4 characters long)",
		// });
		context.title = fields.title;
		context.description = fields.description;
		context.imgURL = fields.imgURL;
		context.isPublic = isPublicOption;
		context.createdAt = dateVar;
		context.type = "error";
		context.message =
			"Please enter a valid title (no special characters and at least 4 characters long)";

		return res.render(`create`, context);
	}

	//...check description
	if (
		fields.description.length < 20 ||
		/[^a-zA-Z 0-9\.]/g.test(fields.description)
	) {
		// res.cookie("status", {
		// 	type: "error",
		// 	message:
		// 		"Please enter a valid description (no special characters and at least 20 characters long)",
		// });
		context.title = fields.title;
		context.description = fields.description;
		context.imgURL = fields.imgURL;
		context.isPublic = isPublicOption;
		context.createdAt = dateVar;
		context.type = "error";
		context.message =
			"Please enter a valid description (no special characters and at least 20 characters long)";

		return res.render(`create`, context);
	}

	//...check url
	if (
		!(
			fields.imgURL.startsWith("http://") ||
			fields.imgURL.startsWith("https://")
		)
	) {
		// res.cookie("status", {
		// 	type: "error",
		// 	message:
		// 		"please select a valid image URL, beginning with \nhttp:// \nor \nhttps://",
		// });
		context.title = fields.title;
		context.description = fields.description;
		context.imgURL = fields.imgURL;
		context.isPublic = isPublicOption;
		context.createdAt = dateVar;
		context.type = "error";
		context.message =
			"Please select a valid image URL, beginning with \nhttp:// \nor \nhttps://";

		return res.render(`create`, context);
	}

	//create new course
	new Course({
		title: fields.title,
		description: fields.description,
		imgURL: fields.imgURL,
		isPublic: isPublicOption,
		createdAt: dateVar,
		usersEnrolled: [],
		creator: res.user.id,
	})
		.save()
		.then((course) => {
			console.log("course createPOST: " + course);

			res.cookie("status", {
				type: "success",
				message: `Course, ${course.title}, created!`,
			});
			res.redirect("/");
		})
		.catch((err) => {
			context.title = fields.title;
			context.description = fields.description;
			context.imgURL = fields.imgURL;
			context.isPublic = isPublicOption;
			context.createdAt = dateVar;
			context.type = "error";
			context.message = "Please select a unique title!";
			return res.render(`create`, context);
		});
};
