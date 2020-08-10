var 	express 			= require("express"),
	 	app 				= express(),
		bodyParser			= require("body-parser"),
		User 				= require("./models/user"),
		Movie 				= require("./models/movie"),
		passport			= require("passport"),
		mongoose 			= require("mongoose"),
		localStrategy 		= require("passport-local"),
		// had to use this to fix issue with find by id function
		ObjectId 			= require('mongodb').ObjectID,
		movieTrailer 		= require( 'movie-trailer' ),
		cookie 				= require('cookie'),
		methodOverride 		= require("method-override"),
		prompt				= require("prompt"),
		flash 				= require("connect-flash")


// create db here
mongoose.connect("mongodb://localhost:27017/movie_app", {useUnifiedTopology:true, useNewUrlParser: true});


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "My God is mighty",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
// to prompt user to confirm if they want to delete movie in sandpit
prompt.start()

app.use(function(req,res,next){
	// provides current user logged in on every request
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next();
})

// //////////////////////////////////////////////////////////////////////////
						// ROUTES
// //////////////////////////////////////////////////////////////////////////


// landing page
app.get("/",function(req,res){
	
	res.render("home")
})
// header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');

// //////////////////////////////////////////////////////////////////////////
						// GENERAL USER ROUTES
// //////////////////////////////////////////////////////////////////////////

// users page: INDEX ROUTE
app.get("/users",function(req,res){
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
app.post("/users", function(req,res){
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
				res.redirect("/users")
			})
		}
	})
})


// //////////////////////////////////////////////////////////////////////////
						// INDIVIDUAL USER ROUTES
// //////////////////////////////////////////////////////////////////////////

app.get("/users/:id", function(req,res){

	var id = req.params.id
	// console.log(id)
	User.findById(id).populate("movies").exec(function(err, foundUser){
		if(err){
			console.log(err)
		}
		else{
			// console.log(foundUser)
			res.render("sandpit", {foundUser:foundUser})
		}
	})
})


// to post new movies to users sandpit
app.post("/users/:id", isLoggedIn, function(req,res){
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
					res.redirect("/")
				}
			})
		}
	})
	
})

// edit movie ratingData
app.put("/users/:id/:movie_id", checkSandpitOwnership, function(req,res){
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
app.delete("/users/:id/:movie_id", checkSandpitOwnership, function(req,res){
	console.log(req.params.movie_id)
	Movie.findByIdAndRemove(req.params.movie_id, function(err, deletedMovie){
		if(err){
			res.redirect("/")
		}
		else{

			res.redirect("/users/" + req.params.id)
		}
	})
})

// //////////////////////////////////////////////////////////////////////////
						// AUTH ROUTES
// //////////////////////////////////////////////////////////////////////////

// registration page: NEW ROUTE
app.get("/signup", function(req,res){
	res.render("signup")
})

// login page
app.get("/login", function(req,res){
	res.render("login")
})

// login post request
app.post('/login', function(req, res, next) {
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
app.get("/logout", function(req,res){
	req.logout()
	req.flash("success","Logged you out")
	res.redirect("/")
})




// //////////////////////////////////////////////////////////////////////////
						//MIDDLEWARE
// //////////////////////////////////////////////////////////////////////////
function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login")
}

function checkSandpitOwnership (req, res, next){
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





app.listen(process.env.PORT || 3000, function(){
	console.log("Movie app started");
	
});