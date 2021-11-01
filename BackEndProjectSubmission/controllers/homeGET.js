const Course = require("../models/Course");
const { validationResult } = require("express-validator");

module.exports = function (req, res) {
	let user = res.user;

	let context = {};

	if (user) {
		context.loggedIn = true;
		context.username = res.user.username;
		context.accountCreatedOn = res.user.accountCreatedOn;
		context.enrolledCourses = res.user.enrolledCourses;
		// console.log(`user.enrolledCourses homeGET: ${user.enrolledCourses}`);
	}

	context.type = res.show;

	if (res.show != "none") {
		context.message = res.message;
	}

	if (context.loggedIn == true) {
		Course.find({}).then((courses) => {
			// console.log("courses homeGET loggedIn: " + courses);
			let courseArray = [];

			courses.forEach((course) => {
				//...date fix
				let isCurrentUser = false;
				let date = course.createdAt;
				// console.log("date" + date);
				let newDate = new Date(date).toDateString();

				let creatorId = course.creator;
				creatorId = JSON.stringify(creatorId);
				creatorId = creatorId.slice(1, creatorId.length - 1);

				if (user.id == creatorId) {
					isCurrentUser = true;
				}

				let subCourse = {
					id: course._id,
					title: course.title,
					description: course.description,
					imgURL: course.imgURL,
					createdAt: newDate,
					usersEnrolled: course.usersEnrolled,
					isPublic: course.isPublic,
					creator: user.username,
					isCurrentUser: isCurrentUser,
				};
				courseArray.push(subCourse);
			});

			function sortFunction(a, b) {
				var dateA = new Date(a.createdAt).getTime();
				var dateB = new Date(b.createdAt).getTime();
				return dateA < dateB ? 1 : -1;
			}
			courseArray.sort(sortFunction);
			// console.log(courseArray);

			// console.log("courseArray homeGET: " + courseArray);
			context.courses = courseArray;

			res.render("user-home", context);
		});
	} else {
		Course.find({}).then((courses) => {
			// console.log("courses homeGET guest : " + courses);

			let courseArray = courses.map((course) => {
				let count = course.usersEnrolled.length;
				//...date fix
				let date = course.createdAt;
				let newDate = new Date(date).toDateString();

				let subCourse = {
					id: course._id,
					name: course.name,
					description: course.description,
					imgURL: course.imgURL,
					createdAt: newDate,
					usersEnrolled: course.usersEnrolled,
					isPublic: course.isPublic,
					count: count,
				};
				return subCourse;
			});
			//console.log(courseArray);

			// use slice() to copy the array and not just a reference
			var byCount = courseArray.slice(0);
			byCount.sort(function (a, b) {
				return b.count - a.count;
			});

			let arrayOfThree = byCount.slice(0, 3);
			// console.log(arrayOfThree);

			context.courses = arrayOfThree;
			// context.message="Success!";

			res.render("guest-home", context);
		});
	}
};
