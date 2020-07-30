var mongoose = require("mongoose")

var MovieSchema = new mongoose.Schema({
	Actors:				String,
	Awards:				String,
	BoxOffice:			String,
	Country:			String,
	DVD:				String,
	Director:			String,
	Genre:				String,
	Language:			String,
	Metascore:			String,
	Plot:				String,
	Poster:				String,
	Production:			String,
	Rated:				String,
	IMDB:				String,
	RottenTomatoes:		String,
	Metacritic:			String,
	Released:			String,
	Response:			String,
	Runtime:			String,
	Title:				String,
	Type:				String,
	Website:			String,
	Writer:				String,
	Year:				String,
	imdbID:				String,
	imdbRating:			String,
	imdbVotes:			String,
})


module.exports = mongoose.model("Movie", MovieSchema)

