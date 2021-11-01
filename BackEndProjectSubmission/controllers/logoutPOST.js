const User = require("../models/User");
const cookieParser = require("cookie-parser");

module.exports = function (req, res) {
	let user = res.user;
	let username = user.username;

	res.clearCookie("user");
	res.cookie("status", {
		type: "success",
		message: `"${username}" logged out successfully`,
	});
	res.redirect("/");
};
