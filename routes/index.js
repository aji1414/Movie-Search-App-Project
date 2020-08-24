var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var axios = require("axios")
// var middleware = require("../middleware/index")

// ========================================
//         LANDING PAGE ROUTE
// ========================================

router.get("/",function(req,res){

	function getTrending(){
		return axios.get("https://api.themoviedb.org/3/trending/movie/week?api_key=64436a1714ae913f7d6492fd1433610c")
	}

	function getTopRated(){
		return axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=64436a1714ae913f7d6492fd1433610c&language=en-US&page=1")
	}

	function getUpcoming(){
		return axios.get("https://api.themoviedb.org/3/movie/upcoming?api_key=64436a1714ae913f7d6492fd1433610c&language=en-US&page=1")
	}
	
	function getTopRatedTV(){
		return axios.get("https://api.themoviedb.org/3/tv/top_rated?api_key=64436a1714ae913f7d6492fd1433610c&language=en-US&page=1")
	}
	
	function getOnAirTV(){
		return axios.get("https://api.themoviedb.org/3/tv/on_the_air?api_key=64436a1714ae913f7d6492fd1433610c&language=en-US&page=1")
	}
	
	function getPopularTV(){
		return axios.get("https://api.themoviedb.org/3/tv/popular?api_key=64436a1714ae913f7d6492fd1433610c&language=en-US&page=1")
	}
	
	axios.all([getTrending(), getTopRated(), getUpcoming(), getTopRatedTV(), getOnAirTV(), getPopularTV()])
		.then(axios.spread(function(trend, top, up, topTV, onAirTV, popTV, finalList){
			var trend 	= trend.data.results.slice(0,5)
			var top		= top.data.results.slice(0,5)
			var up		= up.data.results.slice(0,5)
			var topTV	= topTV.data.results.slice(0,5)
			var onAirTV	= onAirTV.data.results.slice(0,5)
			var popTV	= popTV.data.results.slice(0,5)

			res.render("home", {trend:trend, top:top, up:up, topTV:topTV, onAirTV:onAirTV, popTV:popTV})
		}))
		.catch(function (error) {
			console.log(error);
			res.render("home")
		});
	
})

// ========================================
//              AUTHENTICATION ROUTES
// ========================================

// registration page: NEW ROUTE
router.get("/signup", function(req,res){
	res.render("signup")
})

// login page
router.get("/login", function(req,res){
	res.render("login")
})

// login post request
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
		// put a flash message in here saying wrong password etc
		req.flash("error", "You entered an incorrect combination of username and password")
      return res.redirect("/login");
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect('/users/' + req.user._id);
    });      
  })(req, res, next);
});


// logout route
router.get("/logout", function(req,res){
	req.logout()
	req.flash("success","Logged you out")
	res.redirect("/")
})

module.exports = router;