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
// mongoose.connect("mongodb://localhost:27017/movie_app", {useUnifiedTopology:true, useNewUrlParser: true});
console.log(process.env.DATABASEURL);

var url = process.env.DATABASEURL || "mongodb://localhost:27017/movie_app"
mongoose.connect(url, {useUnifiedTopology:true, useNewUrlParser: true});
// mongoose.connect("mongodb+srv://aji1414:Souther9@yelpcamp.wf3zo.mongodb.net/movie_app?retryWrites=true&w=majority", {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true
// }).then(() =>{
// 	console.log("Connected to DB");
// }).catch(err => {
// 	console.log("ERROR", err.message)
// })

// console.log()eprocess.env.databaseURL

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