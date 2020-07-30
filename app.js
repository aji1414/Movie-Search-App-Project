var 	express 			= require("express"),
	 	app 				= express(),
		bodyParser			= require("body-parser"),
		User 				= require("./models/user"),
		passport			= require("passport"),
		mongoose 			= require("mongoose"),
		localStrategy 		= require("passport-local"),
		// had to use this to fix issue with find by id function
		ObjectId = require('mongodb').ObjectID



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
	res.render("home")
})

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
	var id = ObjectId(req.params.id)
	
	User.findById(id, function(err, foundID){
		if(err){
			console.log(err)
		}
		else{
			// console.log(foundID)
			res.render("sandpit", {user:foundID})
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
app.post("/login",passport.authenticate("local", 
	{
		successRedirect: "/users",
		failureRedirect: "/login"
	}), function(req, res){
})

// logout route
app.get("/logout", function(req,res){
	req.logout()
	// req.flash("success","Logged you out")
	res.redirect("/users")
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


// save for when user auth is all setup
// app.post("/users/:userssandpit", function(req,res){
// 	var data = req.body
// 	res.render("usersandpit", {data:data})
// })






app.listen(process.env.PORT || 3000, function(){
	console.log("Movie app started");
	
});