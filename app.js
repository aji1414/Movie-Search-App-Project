var express 			= require("express")
var app 				= express();
var bodyParser			= require("body-parser")
var axios 				= require("axios");
var request 			= require("request")
var http 				= require('http');
var zlib 				= require("zlib")
var concat 				= require('concat-stream');
var decompress			= require("decompress");
var fetch   			= require("node-fetch")
var fs 					= require("fs")

app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));



var movieTitles = []

app.get("/",function(req,res){
	var moviesearched = req.query.search;
	var url = "https://api.themoviedb.org/3/search/movie?api_key=64436a1714ae913f7d6492fd1433610c&query=" + moviesearched

	var movieJsonFile = "https://drive.google.com/file/d/1mD-sBYmUtgiOMdcVW7D3HrPWyF2I2KZz/view?usp=sharing"

	
	

	
// 	axios.get(url)
// 		  .then(function (response) {
// 			// handle success
// 			var movieData = response.data
// 			console.log(movieData)
// 			console.log(movieData.results.length)
			
// 		  })
// 		  .catch(function (error) {
// 			// handle error
// 			console.log(error);
// 		  })
// 		  .finally(function () {
// 			// always executed
// 		  });
	


	res.render("home")


})









app.listen(process.env.PORT || 3000, function(){
	console.log("Movie app started");
	
});