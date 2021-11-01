const User = require("../models/User");

let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

const saltConfig = require("../config/config").saltRounds;
const jwtConfig = require("../config/config").jwt;

module.exports = function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	console.log("passwordBefore = " + password);

	let context = {};

	User.findOne({ username })
		.then((user) => {
			if (user !== null) {
				//username found
				console.log("loginPOST user: " + user);

				//password check logs
				// console.log("passwordAfter = " + password);
				// console.log(typeof password);

				// console.log("user.password = " + user.password);
				// console.log(typeof user.password);

				//bcrypt compare pass

				bcrypt.compare(password, user.password, function (err, result) {
					if (err) {
						throw err;
					}
					// console.log(password, user.password);
					console.log(result);

					if (result) {
						res.status(200);

						//encrypt user data and save as token
						let userToken = {
							id: user._id,
							username: user.username,
							accountCreatedOn: user.accountCreatedOn,
							enrolledCourses: user.enrolledCourses,
						};
						const token = jwt.sign(
							userToken,
							jwtConfig.secret,
							jwtConfig.options
						);

						// console.log(`token loginPOST: ${token}`);

						//make cookies
						res.cookie("user", token);
						res.cookie("status", {
							type: "success",
							message: `"${username}" logged in successfully!`,
						});

						//go to home page
						res.redirect("/");
					} else {
						res.status(406);
						//bad password + rerender page
						console.log("password problem");
						context.type = "warning";
						context.message = "Incorrect password";
						context.username = username;
						context.password = password;
						res.render("login", context);
					}
				});

				//bad username
			} else {
				res.status(406);

				console.log("no username found");
				context.type = "warning";
				context.message =
					"Username does not match any user in our records";
				context.username = username;
				context.password = password;

				res.render("login", context);
			}
		})
		.catch((err) => {
			console.log(err);
		});
};
