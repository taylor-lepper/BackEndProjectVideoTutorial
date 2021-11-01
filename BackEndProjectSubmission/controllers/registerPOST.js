const User = require("../models/User");

let bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const saltConfig = require("../config/config").saltRounds;

module.exports = function (req, res) {
	let { errors } = validationResult(req);
	let fields = req.body;
	let context = {};
	console.log(fields);

	//...input fields + context
	let username = fields.username;
	let password = fields.password;
	let rePass = fields.repeatPassword;
	context.username = username;
	context.password = password;
	context.rePass = rePass;

	//...set created date
	let dateVar = fields.accountCreatedOn;
	dateVar = dateVar.split("T")[0];
	console.log(dateVar);

	//...username and password precheck for length
	if (errors.length > 1) {
		console.log(errors);
		if (errors[0].param == "username") {
			context.type = "error";
			context.message =
				"Please make sure your username is at least 5 characters long, and only contains english letters and numbers.";
		} else {
			context.type = "error";
			context.message =
				"Please make sure your password is at least 5 characters long, and only contains english letters and numbers.";
		}

		return res.render("register", context);
	}

	//...check DB for username to see if taken already
	User.find({ username: username }).then((users) => {
		//...username found (taken)
		if (users.length > 0) {
			context.type = "warning";
			context.message = "Sorry Username has already been taken!";
			return res.render("register", context);
		}

		if (password.length < 5) {
			context.type = "error";
			context.message =
				"Please make sure your password is at least 5 characters long, and only contains letters and numbers.";
			return res.render("register", context);
		}

		//...passwords equal??
		if (password !== rePass) {
			context.type = "error";
			context.message = "Please make sure both of your passwords match!";
			return res.render("register", context);
		} else {
			//encrypt password
			bcrypt.genSalt(saltConfig, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					console.log(hash);
					//create a new user in the db
					new User({
						username: username,
						password: hash,
						accountCreatedOn: dateVar,
						enrolledCourses: [],
					})
						.save()
						.then((user) => {
							res.status(201);
							console.log(`User was created successfully!`);
							console.log(user);
							res.cookie("status", {
								type: "success",
								message: `New User, "${username}" created!`,
							});

							res.redirect("/login");
						})
						.catch((err) => {
							console.log(err);
							context.type = "error";
							context.message =
								"Problem saving to database!, this username has already been taken!";
							return res.render(`register`, context);
						});
				});
			});
		}
	});
};
