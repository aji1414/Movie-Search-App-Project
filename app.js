var 	express 			= require("express"),
	 	app 				= express(),
		bodyParser			= require("body-parser"),
		User 				= require("./models/user"),
		passport			= require("passport"),
		mongoose 			= require("mongoose"),
		localStrategy 		= require("passport-local")



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




// landing page
app.get("/",function(req,res){
	res.render("home")
})

// registration page
app.get("/register", function(req,res){
	res.render("register")
})

// index route
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

// CREATE ROUTE
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

app.get("/users/:usersandpit", function(req,res){
	res.render("usersandpit")
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