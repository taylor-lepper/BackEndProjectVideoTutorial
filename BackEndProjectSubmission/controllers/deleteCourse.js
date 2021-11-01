const Course = require("../models/Course");
const User = require("../models/User");

module.exports = function (req, res) {
	let id = req.params.id;

	// console.log(id);
	Course.findByIdAndRemove(id).then((course) => {
		res.cookie("status", {
			type: "success",
			message: `${course.title} successfully deleted!`,
		});
		console.log("deleted course: " + course);
		res.redirect("/");
	});
};
