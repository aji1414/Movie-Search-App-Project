var 	express 			= require("express"),
	 	app 				= express(),
		bodyParser			= require("body-parser")
		
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
	res.render("users")
})

app.get("/users/:usersandpit", function(req,res){
	res.render("usersandpit")
})






// save for when user auth is all setup
// app.post("/users/:userssandpit", function(req,res){
// 	var data = req.body
// 	res.render("usersandpit", {data:data})
// })






app.listen(process.env.PORT || 3000, function(){
	console.log("Movie app started");
	
});