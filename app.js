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

// index route
app.get("/users",function(req,res){
	// console.log(req.url)
	res.render("users")
})

app.post("/:users/usersmovies", function(req,res){
	var data = JSON.parse(req.body.movieData1)
	console.log(data)
	res.send("you hit the post route")
})














app.listen(process.env.PORT || 3000, function(){
	console.log("Movie app started");
	
});