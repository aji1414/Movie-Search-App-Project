var 	express 			= require("express"),
	 	app 				= express(),
		bodyParser			= require("body-parser"),
		User 				= require("./models/user"),
		passport			= require("passport"),
		mongoose 			= require("mongoose"),
		localStrategy 		= require("passport-local"),
		// had to use this to fix issue with find by id function
		methodOverride 		= require("method-override"),
		prompt				= require("prompt"),
		flash 				= require("connect-flash"),
		indexRoutes 		= require("./routes/index"),
		userRoutes 			= require("./routes/users"),
		middleware			= require("./middleware/index")

// create db here
mongoose.connect("mongodb://localhost:27017/movie_app", {useUnifiedTopology:true, useNewUrlParser: true});


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "the secret is as you wish",
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
	res.locals.currentUser 	= req.user;
	res.locals.error 		= req.flash("error")
	res.locals.success 		= req.flash("success")
	next();
})


// ROUTES
app.use("/users",userRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("Movie app started");
	
});