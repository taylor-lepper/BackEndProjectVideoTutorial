const User = require("../models/User");
const Course = require("../models/Course");

module.exports = {
	get: (req, res) => {
		id = req.params.id;
		let context = {};
		let user = res.user;

		//messages
		context.type = res.show;
		if (res.show != "none") {
			context.message = res.message;
		}

		if (user) {
			//user context
			context.loggedIn = true;
			context.username = res.user.username;
			context.accountCreatedOn = res.user.accountCreatedOn;
			context.enrolledCourses = res.user.enrolledCourses;
			console.log(`user.username editGET: ${user.username}`);

			//find to edit by id
			Course.findById(id).then((course) => {
				// console.log(user);
				// console.log(course);

				context.id = course._id;
				context.title = course.title;
				context.description = course.description;
				context.imgURL = course.imgURL;
				context.isPublic = course.isPublic;

				console.log(context);
				res.render("edit", context);
			});
		} else {
			res.cookie("status", {
				type: "error",
				message: "User needs to be logged in to view this page",
			});
			res.redirect(`/`);
		}
	},
	post: (req, res) => {
		let context = {};
		let id;
		id = req.params.id;

		let updates = req.body;
		// console.log("updates: " + updates);
		//public?
		let isPublicOption = false;

		if (updates.isPublic !== "") {
			isPublicOption = true;
		}

		//...check title
		if (
			updates.title.length < 4 ||
			/[^a-zA-Z 0-9\.]/g.test(updates.title)
		) {
			res.cookie("status", {
				type: "error",
				message:
					"please enter a valid title (no special characters and at least 4 characters long)",
			});

			return res.redirect(`/course/edit/${id}`);
		}

		//...url check
		if (
			!(
				updates.imgURL.startsWith("http://") ||
				updates.imgURL.startsWith("https://")
			)
		) {
			res.cookie("status", {
				type: "error",
				message: "Please select a valid image URL",
			});
			return res.redirect(`/course/edit/${id}`);
		}

		if (
			updates.description.length < 20 ||
			/[^a-zA-Z 0-9\.]/g.test(updates.description)
		) {
			res.cookie("status", {
				type: "error",
				message:
					"Please enter a valid description (no special characters and less than 50 characters long)",
			});
			return res.redirect(`/course/edit/${id}`);
		}

		Course.findById(id).then((course) => {
			console.log("isPublic :" + isPublicOption);

			course.title = updates.title;
			course.description = updates.description;
			course.imgURL = updates.imgURL;
			course.isPublic = isPublicOption;

			course
				.save()
				.then((course) => {
					console.log("update successful");
					res.cookie("status", {
						type: "success",
						message: "Update successful",
					});
					res.redirect(`/course/details/${id}`);
				})
				.catch((err) => {
					console.log(err);
					context.id = id;
					context.title = updates.title;
					context.description = course.description;
					context.imgURL = course.imgURL;
					context.isPublic = isPublicOption;
					context.type = "error";
					context.message =
						"Problem saving to database!, this name has already been taken!";
					return res.render(`edit`, context);
				});
		});
	},
};
