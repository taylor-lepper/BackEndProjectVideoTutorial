//packages
let jwt = require("jsonwebtoken");
const { body } = require("express-validator");

//constants
const jwtConfig = require("../config/config").jwt;

//Models
const User = require("../models/User");
const Course = require("../models/Course");

//Controllers

const createPOST = require("../controllers/createPOST");
const deleteCourse = require("../controllers/deleteCourse");
const detailsGET = require("../controllers/detailsGET");
const editCourse = require("../controllers/editCourse");
const enrollPOST = require("../controllers/enrollPOST");
const homeGET = require("../controllers/homeGET");
const loginPOST = require("../controllers/loginPOST");
const logoutPOST = require("../controllers/logoutPOST");
const profileGET = require("../controllers/profileGET");
const registerPOST = require("../controllers/registerPOST");
const search = require("../controllers/search");

module.exports = (app) => {
	//auth
	app.use((req, res, next) => {
		//Check for user logged in User to pass to other pages

		if (req.cookies.user) {
			let token = req.cookies.user;
			// console.log(`token AppUSE: ${token}`);

			let decodedJWT = jwt.verify(token, jwtConfig.secret);
			// console.log(`decodedJWT.id: ${decodedJWT.id}`);
			// console.log(`decodedJWT.username: ${decodedJWT.username}`);
			// console.log("enrolledcourses: " + decodedJWT.enrolledCourses);
			let date = decodedJWT.accountCreatedOn.split("T")[0];
			res.user = {
				id: decodedJWT.id,
				username: decodedJWT.username,
				accountCreatedOn: date,
				enrolledCourses: decodedJWT.enrolledCourses,
			};
		}
		if (req.cookies.status) {
			let status = req.cookies.status;
			console.log(`status: ${status.message}`);
			res.clearCookie("status");

			res.show = status.type;
			res.message = status.message;
		}
		if (res.show == undefined) {
			res.show = "none";
		}
		next();
	});

	//...home page
	app.get("/", homeGET);

	//...register
	app.get("/register", function (req, res) {
		let user = res.user;
		let context = {};

		//error messages
		context.type = res.show;
		if (res.show != "none") {
			context.message = res.message;
		}

		//logged in?
		if (!user) {
			res.render("register", context);
		} else {
			res.cookie("status", {
				type: "error",
				message: "Unauthorized, prepare to be LOGGED OUT!",
			});
			res.clearCookie("user");
			res.redirect("/");
		}
	});
	app.post(
		"/register",
		body("username").trim().isLength({ min: 5 }).isAlphanumeric(),
		body("password").trim().isLength({ min: 5 }).isAlphanumeric(),
		registerPOST
	);

	//...login
	app.get("/login", function (req, res) {
		let user = res.user;
		let context = {};

		//error messages
		context.type = res.show;
		if (res.show != "none") {
			context.message = res.message;
		}

		//check for login
		if (!user) {
			res.render("login", context);
		} else {
			res.cookie("status", {
				type: "error",
				message: "Unauthorized, prepare to be LOGGED OUT!",
			});
			res.clearCookie("user");
			res.redirect("/");
		}
	});
	app.post("/login", loginPOST);

	//...logout
	app.get("/logout", function (req, res) {
		if (res.user) {
			let context = {};
			context.type = "none";
			context.loggedIn = true;
			context.username = res.user.username;

			res.render("logout", context);
		} else {
			res.cookie("status", {
				type: "warning",
				message: "User not logged in!",
			});
			res.redirect("/");
		}
	});
	app.get("/logout/user", logoutPOST);

	//...profile
	app.get("/profile", profileGET);

	//...create-course
	app.get("/course/create", function (req, res) {
		let context = {};
		context.type = res.show;
		if (res.show != "none") {
			context.message = res.message;
		}

		if (res.user) {
			context.type = "none";
			context.loggedIn = true;
			context.username = res.user.username;

			res.render("create", context);
		} else {
			res.cookie("status", {
				type: "warning",
				message: "User not logged in!",
			});
			res.redirect("/");
		}
	});
	app.post("/course/create", createPOST);

	//...enroll in course
	app.get("/course/enroll/:id", enrollPOST);

	//...edit-course
	app.get("/course/edit/:id", editCourse.get);
	app.post("/course/edit/:id", editCourse.post);

	//...delete-course
	app.get("/course/delete/:id", deleteCourse);

	//...course-details
	app.get("/course/details/:id", detailsGET);

	//...videos
	app.get("/videos", function (req, res) {
		let context = {};
		res.show = "none";
		if (res.user) {
			context.loggedIn = true;
			context.username = res.user.username;
		}

		res.render("videos", context);
	});

	//...search
	app.post("/search", search);

	//...404
	app.get("*", function (req, res) {
		let context = {};
		res.show = "none";
		if (res.user) {
			context.loggedIn = true;
			context.username = res.user.username;
		}

		res.render("404", context);
	});
};
