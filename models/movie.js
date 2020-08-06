var mongoose = require("mongoose")

var MovieSchema = new mongoose.Schema({
	Actors:				String,
	Awards:				String,
	BoxOffice:			String,
	Country:			String,
	Director:			String,
	Genre:				String,
	Language:			String,
	Plot:				String,
	Poster:				String,
	Production:			String,
	Rated:				String,
	IMDB:				String,
	RottenTomatoes:		String,
	Metacritic:			String,
	Released:			String,
	Runtime:			String,
	Trailer:			String,
	Title:				String,
	Type:				String,
	Writer:				String,
	Year:				String,
	imdbID:				String,
	imdbVotes:			String,
	UserRating:			String,
	UserReview:			String,
	User: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
	
})

module.exports = mongoose.model("Movie", MovieSchema)