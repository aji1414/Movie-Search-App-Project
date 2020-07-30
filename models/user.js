var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
	username: 			String,
	password: 			String,
	email	: 			String,
	profilepicture: 	String,
	movies: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Movie"
		}
	]
	
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)
