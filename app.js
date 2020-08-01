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
		cookie 				= require('cookie')


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
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req,res,next){
	// provides current user logged in on every request
	res.locals.currentUser = req.user;
	// res.locals.error = req.flash("error")
	// res.locals.success = req.flash("success")
	next();
})

// //////////////////////////////////////////////////////////////////////////
						// ROUTES
// //////////////////////////////////////////////////////////////////////////


// landing page
app.get("/",function(req,res){

	// res.setHeader('Set-Cookie', [
	//   'same-site-cookie=bar; SameSite=None',
	//   'cross-site-cookie=foo; SameSite=None; Secure',
	// ])
	// res.setHeader()
	// res.cookie('same-site-cookie', 'foo', { sameSite: 'none', secure: true });
	// res.cookie('cross-site-cookie', 'bar', { sameSite: 'none', secure: true });	
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
			// console.log(allusers)
			// console.log(typeof allusers)
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
			console.log(err)
		}
		else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/users")
			})
		}
	})
})


// //////////////////////////////////////////////////////////////////////////
						// INDIVIDUAL USER ROUTES
// //////////////////////////////////////////////////////////////////////////

app.get("/users/:id", function(req,res){
// 	objectId maybe?
	var id = req.params.id
	// console.log(id)
	User.findById(id).populate("movies").exec(function(err, foundUser){
		if(err){
			console.log(err)
		}
		else{
			console.log(foundUser)
			res.render("sandpit", {foundUser:foundUser})
		}
	})
})


// to post new movies to users sandpit
app.post("/users/:id", function(req,res){
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
		Writer: Writer,}
	
	// console.log(req.user)
	// var id = ObjectId(req.params.id)
	// console.log(id)
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
					newMovie.User.id = req.user._id;
					newMovie.User.username = req.user.username
					// save movie
					newMovie.save()
					// connect new movie to user and save
					foundUser.movies.push(newMovie)
					foundUser.save()
					console.log(foundUser)
					// redirect to users sandpit
					res.redirect("/users/" + req.user._id)
				}
			})
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
      return res.send({ success : false, message : 'authentication failed' });
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
	// req.flash("success","Logged you out")
	res.redirect("/")
})




// router.post("/register", function(req, res){
// 	var newUser = new User({username: req.body.username})
// 	User.register(newUser, req.body.password, function(err,user){
// 		if(err){
// 			// req.flash("error", err.message)
// 			return res.render("register", {"error": err.message})
// 		}
// 		passport.authenticate("local")(req,res,function(){
// 			req.flash("success","Welcome to YelpCamp" + user.username)
// 			res.redirect("/campgrounds")
// 		})
// 	})
// })







app.listen(process.env.PORT || 3000, function(){
	console.log("Movie app started");
	
});