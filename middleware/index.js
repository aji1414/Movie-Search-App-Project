var Movie = require("../models/movie")

// //////////////////////////////////////////////////////////////////////////
						//MIDDLEWARE
// //////////////////////////////////////////////////////////////////////////

var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login")
}

middlewareObj.checkSandpitOwnership =function(req, res, next){
	if(req.isAuthenticated()){
		Movie.findById(req.params.movie_id, function(err, foundMovie){
			if(err){
				console.log("Movie not found")
			}
			else{
				if(foundMovie.User.id.equals(req.user._id)){
					next();
				}
				else{
					console.log("You don't have permission to do that")
					res.redirect("/users/" + req.params.id)
				}
			}
		})
	}
	else{
		console.log("You need to be logged in to do that")
		req.flash("error", "You need to be logged in to do that")
		res.redirect("/login")
	}
}

module.exports = middlewareObj