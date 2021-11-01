module.exports = {
	development: {
		port: process.env.PORT || 3000,
	},
	production: {},
	saltRounds: 9,
	jwt: {
		secret: "programmingComplete",
		options: {
			expiresIn: "2d",
		},
	},
};
