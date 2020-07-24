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





app.get("/",function(req,res){


	res.render("home")


})









app.listen(process.env.PORT || 3000, function(){
	console.log("Movie app started");
	
});