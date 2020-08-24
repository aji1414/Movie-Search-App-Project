var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var User = require("../models/user");
var Movie = require("../models/movie")


// //////////////////////////////////////////////////////////////////////////
						// GENERAL USER ROUTES
// //////////////////////////////////////////////////////////////////////////

// users page: INDEX ROUTE
router.get("/",function(req,res){
	// console.log(req.url)
	User.find({}, function(err,allusers){
		if(err){
			console.log(err)
		}
		else{
			res.render("users", {users:allusers})
		}
	})

})

// setup new user: CREATE ROUTE
router.post("/", function(req,res){
	var newUser = new User({username: 			req.body.username,
						   	email	: 			req.body.email,
							profilepicture:		req.body.profilepicture
						   })
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			req.flash("error", err.message)
			res.redirect("/signup")
		}
		else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success", "Welcome to Movie Sandpit " + req.user.username + "!")
				res.redirect("/")
			})
		}
	})
})


// //////////////////////////////////////////////////////////////////////////
						// INDIVIDUAL USER ROUTES
// //////////////////////////////////////////////////////////////////////////

router.get("/:id", function(req,res){

	var id = req.params.id
	// console.log(id)
	User.findById(id).populate("movies").exec(function(err, foundUser){
		if(err){
			console.log(err)
		}
		else{
			// console.log(req)
			res.render("sandpit", {foundUser:foundUser})
		}
	})
})


// to post new movies to users sandpit
router.post("/:id", middleware.isLoggedIn, function(req,res){
	// unstringify as its stored as string in the html
	var movieObject   	= JSON.parse(req.body.movieData)
	var Title 			= movieObject.Title;
	var	Year			= movieObject.Year;
	var	Rated			= movieObject.Rated;
	var	Released		= movieObject.Released;
	var	Runtime			= movieObject.Runtime;
	var	Genre			= movieObject.Genre;
	var	Director		= movieObject.Director;
	var	Actors			= movieObject.Actors;
	var	Plot			= movieObject.Plot;
	var	Language		= movieObject.Language;
	var	Country			= movieObject.Country;
	var	Awards			= movieObject.Awards;
	var	Poster			= movieObject.Poster;
	var	IMDB			= movieObject.Ratings[0].Value;
	var	RottenTomatoes	= movieObject.Ratings[1].Value;
	var	Metacritic		= movieObject.Ratings[2].Value;
	var	imdbID			= movieObject.imdbID;
	var	imdbVotes		= movieObject.imdbVotes;
	var	BoxOffice		= movieObject.BoxOffice;
	var	Production		= movieObject.Production;
	var	Type			= movieObject.Type;
	var	Writer			= movieObject.Writer;
	var Trailer 		= req.body.trailerData;
	var UserRating		= req.body.ratingData;
	var UserReview		= req.body.reviewData;

	
	var newMovie = {
		Title: Title,
		Year: Year,
		Released: Released,
		Runtime: Runtime,
		Genre: Genre,
		Director: Director,
		Actors: Actors,
		Plot: Plot,
		Language: Language,
		Country: Country,
		Awards: Awards,
		Poster: Poster,
		IMDB: IMDB,
		RottenTomatoes: RottenTomatoes,
		Metacritic: Metacritic,
		imdbID: imdbID,
		imdbVotes: imdbVotes,
		BoxOffice: BoxOffice,
		Production: Production,
		Type: Type,
		Writer: Writer,
		Trailer: Trailer,
		UserRating: UserRating,
		UserReview: UserReview}

	User.findById(req.user._id, function(err,foundUser){
		if(err){
			console.log(err)
		}
		else{
			// create new movie entry
			Movie.create(newMovie, function(err, newMovie){
				if(err){
					// console.log(err)
				}
				else{
					// console.log(newMovie)
					// add user id and username to new movie entry in database
					newMovie.User.id = req.user._id;
					newMovie.User.username = req.user.username
					// save movie
					newMovie.save()
					// connect new movie to user and save
					foundUser.movies.push(newMovie)
					foundUser.save()
					// console.log(foundUser)
					// redirect to users sandpit
					req.flash("success", "movie added to sandpit!")
					res.redirect("/users/" + req.user._id)
				}
			})
		}
	})
	
})

// edit movie ratingData
router.put("/:id/:movie_id", middleware.checkSandpitOwnership, function(req,res){
	Movie.findById(req.params.movie_id, function(err,foundMovie){
		if (err){
			console.log(err)
		}
		else{
			foundMovie.UserRating = req.body.userReview
			foundMovie.save()
			res.redirect("/users/" + req.params.id)
		}
	})
})

// delete movie route setup
router.delete("/:id/:movie_id", middleware.checkSandpitOwnership, function(req,res){
	Movie.findByIdAndRemove(req.params.movie_id, function(err, deletedMovie){
		if(err){
			res.redirect("/")
		}
		else{

			res.redirect("/users/" + req.params.id)
		}
	})
})

module.exports = router;
