const User = require("../models/User");
const Course = require("../models/Course");

module.exports = function (req, res) {
	let user = res.user;
	//console.log(user);
	let context = {};
	if (user) {
		context.loggedIn = true;
		context.username = res.user.username;
		context.accountCreatedOn = res.user.accountCreatedOn;
		context.enrolledCourses = res.user.enrolledCourses;
		console.log(`user.username detailsGET: ${user.username}`);
	}

	context.type = res.show;
	if (res.show != "none") {
		context.message = res.message;
	}
	//console.log(req.params);
	let id;
	id = req.params.id;

	//find course by ID
	Course.findById(id)
		.populate("usersEnrolled")
		.then((course) => {
			// console.log(course);
			//enrolled users
			let enrolledInCourseIDS = course.usersEnrolled.map((enrolled) => {
				// console.log(enrolled);
				let id = enrolled._id;
				let newID = JSON.stringify(id);
				newID = newID.slice(1, newID.length - 1);
				// console.log(newID);
				return newID;
			});

			// console.log(enrolledInCourseIDS);

			//...isEnrolled?

			for (let eachID of enrolledInCourseIDS) {
				// console.log(eachID);

				if (user.id == eachID) {
					console.log("enrolled match found!");
					context.isEnrolled = true;
				}
			}

			let date = course.createdAt;
			// console.log(typeof date);
			let newDate = new Date(date).toDateString();
			// console.log(newDate);

			//...isCreator?
			let creatorId = course.creator;
			creatorId = JSON.stringify(creatorId);
			creatorId = creatorId.slice(1, creatorId.length - 1);

			console.log("user and creator ids: " + user.id, creatorId);
			if (user.id == creatorId) {
				console.log("creator match!");
				context.isCreator = true;
			}

			//add details context
			context.id = course._id;
			context.title = course.title;
			context.description = course.description;
			context.imgURL = course.imgURL;
			context.createdAt = newDate;
			context.usersEnrolled = course.usersEnrolled;

			res.render("details", context);
		});
};
