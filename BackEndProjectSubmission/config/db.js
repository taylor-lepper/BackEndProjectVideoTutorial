const mongoose = require("mongoose");

module.exports = (app) => {
	// mongoose.connect("mongodb://localhost:27017/project");

	mongoose
		.connect("mongodb://localhost:27017/project", {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			autoIndex: true,
		})
		.then(() => {
			console.log("Connected to mongoDB");
		});
};
