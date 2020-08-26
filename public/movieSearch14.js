// change size of movie divs depending on screen size
function windowSize(){
        // Get width of the window
        var w = document.documentElement.clientWidth;
        
		// get number of movies
		var noMovies = divCount().noMovies
		if (noMovies === 1 || w <= 870){
				divResize(width = "col-12", height = "normal", imgW = "800px")
		}
		else if (noMovies == 4){
			if(w <= 860){
				divResize(width = "col-12")
			}
			else if(w <= 1860){
				divResize(width = "col-6", height = "shrink", imgW = "300px")
			}
			else{
				divResize(width = "col-3", height = "normal",  imgW ='450px')	
			}		
		}
		else if (noMovies == 3){
			if(w <=860){
				divResize(width = "col-12")
			}
			else if(w <= 1860){
				divResize(width = "col-6", height = "shrink", imgW = "300px")
			}
			else{
				divResize()
			}
		}
		else if (noMovies == 2){
			if(w <= 1260){
				divResize(width = "col-12")
			}
			else{
				divResize()
			}
		}
}
// event listener for when screen is changed, to run the function above
window.addEventListener("resize", windowSize);

// stores current colwidth for div to be used upon creation and deletion of new movies
var colWidth = ""

// function which counts current active divs. To stop user 
function divCount(){
	noMovies = 0;
	activeDivs = [];
	for(var i = 1; i <= 4; i++){
			if(!document.querySelector(".movie" + i).classList.contains("d-none")){
				noMovies ++
				activeDivs.push(".movie" + i)
			}	
		};
	return {noMovies,
			activeDivs}
}

// function to resize divs when new movies added or old ones deleted
function divResize(width, height, imgW){
	// change image width and div height where necessary
	if (imgW){
			$(".flip-card-front img").css("width", imgW)
			// $(".flip-card-front img").css("min-width", imgW)
	}
	else{
			$(".flip-card-front img").css("width", "600px")
			// $(".flip-card-front img").css("min-width", "600px")
	}
	
	if (height == "shrink"){
		$(".flip-card").css("height", "290px")
	}
	else{
		$(".flip-card").css("height", "650px")
	}

	// find current divs showing on screen
	var noMovies = divCount().noMovies
	var activeDivs = divCount().activeDivs
	
	oldColWidth			= colWidth
	if(width){
		colWidth		= width
	}
	else{
		colWidth 		= "col-" + (12/(noMovies))
	}
	
	// for every active div on page, deletes old spacing class, then adds new spacing class
		for(var n = 0; n < activeDivs.length; n++){
			if(oldColWidth){
				document.querySelector(activeDivs[n]).classList.remove(oldColWidth)
				document.querySelector(activeDivs[n]).classList.add(colWidth)
			}
			else{
				document.querySelector(activeDivs[n]).classList.add(colWidth)
			}
		}
	
	// restore content on the page if it had been hidden to display search results. Otherwise, adjust size of poster images
	if(noMovies === 0){
		document.querySelector(".container").style.display = "block"
	}
	return colWidth
}

// The autoComplete.js Engine instance creator
const autoCompletejs = new autoComplete({
	data: {
		src: async () => {
			// Loading placeholder text
			document
				.querySelector("#autoComplete")
				.setAttribute("placeholder", "Loading...");
			// Fetch External Data Source
			var movieSearched = document.querySelector("#autoComplete").value
			const source = await fetch(
				"https://api.themoviedb.org/3/search/movie?api_key=64436a1714ae913f7d6492fd1433610c&language=en-US&query=" + movieSearched + "&page=1&include_adult=false"
			);
			// console.log(movieSearched)
			const data = await source.json();
			// Post loading placeholder text
			document
				.querySelector("#autoComplete")
				.setAttribute("placeholder", "Search Movies");
			// Returns Fetched data
			
			return data.results;
		},
		
		key: ["original_title"],
		cache: false
	},
	sort: (a, b) => {
		if (a.match < b.match) return -1;
		if (a.match > b.match) return 1;
		return 0;
	},
	placeHolder: "Search Movies",
	selector: "#autoComplete",
	threshold: 1,
	debounce: 300,
	searchEngine: "strict",
	highlight: true,
	maxResults: 15,
	resultsList: {
		render: true,
		container: source => {
      source.setAttribute("id", "autoComplete_list");
		},
		destination: document.querySelector("#autoComplete"),
		position: "afterend",
		element: "ul"
	},
	resultItem: {
		content: (data, source) => {
      source.innerHTML = data.match;
		},
		element: "li"
	},
	noResults: () => {
		const result = document.createElement("li");
		result.setAttribute("class", "no_result");
		result.setAttribute("tabindex", "1");
		result.innerHTML = "No Results";
		document.querySelector("#autoComplete_list").appendChild(result);
	},
	onSelection: feedback => {
		// removes existing content on any page if user initiates search and adds movie to look at
		var checkIfContent =  document.querySelector(".container")
		if(checkIfContent){
			if(checkIfContent.style.display !== "none"){
			// checkIfContent.classList.toggle("d-flex")
			checkIfContent.style.display = "none"
			}
		}
		
		// alert for when already chosen 4 movies
		if(divCount().noMovies === 4){
			alert("No more movies allowed!")
		}
		else{
			// resets div to change variable to 1
			var divToChange	= 1
			// console.log("on click is " + divToChange)

			// logic to choose in which div new movie will go into on page. Checks if there is an image already in each div
			// if there is an image, there is already a movie in that slot
			for (var q = 1; q <= 4; q++){
					if (document.querySelector(".poster" + q).innerHTML.length === 0){
					break
					}
					else{
						divToChange ++
					}
			}

			// unhide div selected
			document.querySelector(".movie" + divToChange).classList.remove("d-none");

			// run function that adjusts spacing of divs with the new extra div
			windowSize();
			
			var imdbDataExists = true
			
			// API CALL TO BRING IN MORE MOVIE DATA ON MOVIE SELECTED. Has to do api call on TMDB site first to find the imdb id of selected film
			async function getMovieData() {
			// var imdbID 		= feedback.selection.value.imdbID;
			var movie 					= feedback.selection.value
			var id 						= movie.id
			var query 					= await fetch("https://api.themoviedb.org/3/movie/" + id + "/external_ids?api_key=64436a1714ae913f7d6492fd1433610c")
			var imdb 					= await query.json();

			if(imdb.imdb_id == null){
				// console.log("trigger")
				imdbDataExists = false
			}
			else{
				imdbDataExists = true
			}

			var imdb_id 				= await imdb.imdb_id
			let response 				= await fetch("https://www.omdbapi.com/?i=" + imdb_id + "&apikey=thewdb");
			let data					= await response.json();
			// console.log(data)
			return data;
			
				
			}
	
			// api call for movie trailer. Had to do separate to stuff below due to scoping issues as they use different sources
			setTimeout(function(){
				movieTrailer(feedback.selection.value.original_title, {id: true, multi: true}).then(function(result){
				document.querySelector(".trailerData" + divToChange).value = "https://www.youtube-nocookie.com/embed/" + result[0]
				document.querySelector(".trailer" + divToChange).setAttribute("src","https://www.youtube-nocookie.com/embed/" + result[0])	
				})
			},1000)
									
			// Render all movie info to correct div
			getMovieData().then(function(result) {
				// Render page elements						
				// trailer data
				if(imdbDataExists == false){
					Object.keys(result).forEach(k => delete result[k])
					result =  	{
								Title: feedback.selection.value.original_title,
								Released: feedback.selection.value.releaseDate,
								Plot: feedback.selection.value.overview,
								Poster: "https://image.tmdb.org/t/p/w500/" + feedback.selection.value.poster_path,
								Runtime: "N/A",
								Actors: "N/A",
								Wrter: "Unknown",
								Awards: "Unknown",
								Director: "Unknown",
								BoxOffice: "Unknown",
								imdbVotes: "Unknown",
								Genre: "Unknown",
								Ratings: ["N/A", "N/A", "N/A"]
								}
				}
	
				var movieRatings 		= 	[[".imdb",'https://cdn.freebiesupply.com/images/thumbs/2x/imdb-logo.png'],
											[".metacritic", 'https://www.indiewire.com/wp-content/uploads/2019/05/rt_logo_primary_rgb-h_2018.jpg'],
											[".rottenTomatoes", 'https://seekvectorlogo.com/wp-content/uploads/2020/06/metacritic-vector-logo.png']]

				// pass through no ratings label if can't be found
				for(var i = 0; i < movieRatings.length; i++){
					try{
						$(movieRatings[i][0] + divToChange).html("<div>" + result.Ratings[i].Value + "</div> <div><img class = 'reviewCompanies' src = '" + movieRatings[i][1] + "'></div>")
					}
					catch(err){
						$(movieRatings[i][0] + divToChange).html("<div>No Rating Available</div> <div><img class = 'reviewCompanies' src = '" + movieRatings[i][1] + "'></div>")
					}
				}
				
				// other data
				// some data manipulation
				// depends if poster is from imdb or from original api pull
				if (result.Poster){
					if (imdbDataExists == false){
						$(".poster" + divToChange).html("<img  src = '" + result.Poster + "' class='img-fluid' alt='Responsive image'>")
						
					}
					else{
						var highQualityPoster 	= result.Poster.substr(0,result.Poster.length - 7) + "600.jpg"
						$(".poster" + divToChange).html("<img  src = '" + highQualityPoster + "' class='img-fluid' alt='Responsive image'>")
					}
							
				}
				else{
					$(".poster" + divToChange).html("<img  src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png' class='img-fluid' alt='Responsive image'>")
				}
				
				// if(result.Genre){
					var Genre 				= result.Genre.split(',')
					$(".genre" + divToChange).html(Genre.slice(0,3)) 
				// }
				
				
				$(".title" + divToChange).html(result.Title)
				$(".runtime" + divToChange).html(result.Runtime) 				 
				$(".releaseDate" + divToChange).html(result.Released) 			 
				$(".plot" + divToChange).html(result.Plot) 				 
				$(".actors" + divToChange).html(result.Actors) 				 
				$(".writers" + divToChange).html(result.Writer) 				 
				$(".awards" + divToChange).html(result.Awards) 				 
				$(".director" + divToChange).html(result.Director) 			 
				$(".boxoffice" + divToChange).html(result.BoxOffice) 			 
				$(".imdbvotes" + divToChange).html(result.imdbVotes) 			 
							
				
				// store all movie data in html doc which will be stored in database if user adds film to sandpit
				document.querySelector(".movieData" + divToChange).value 				= JSON.stringify(result)

				// if no trailer, change trailer div to nothing found image
				setTimeout(function(){
					if($(".trailer" + divToChange).attr("src").length <= 10){
					$(".trailerOuter" + divToChange).html("<img  src = 'https://image.flaticon.com/icons/png/512/678/678523.png' class='img-fluid' alt='Responsive image'>")
				}}, 8000)
			});
			// Clear Input
			document.querySelector("#autoComplete").value = "";
		}	
	}
});

// event listener for when search bar is clicked on and off
["focus", "blur"].forEach(function(eventType) {
  const resultsList = document.querySelector("#autoComplete_list");

  document.querySelector("#autoComplete").addEventListener(eventType, function() {
    // Hide results list & show other elemennts
    if (eventType === "blur") {
      resultsList.style.display = "none";
    } else if (eventType === "focus") {
      // Show results list & hide other elemennts
      resultsList.style.display = "block";
    }
  });
});

// event listener to remove div when remove delete button clicked
$("div").on("click", "div div .removeHome", function(){
	
	// find current movie div and its rank number of current movie div
	var movieDiv = this.parentNode.parentNode
	var movieDivNo = $(movieDiv).index() + 1
	
	// stop movie trailer by simply resetting source link to blank
	var trailer = this.parentNode.parentNode.querySelector("iframe")

	if(trailer){
		trailer.setAttribute("src","")
		
		// turn card back over to front if user had flipped it to back before removing it
		if(!movieDiv.querySelector("iframe").classList.contains("d-none")){
		   movieDiv.querySelector(".turn-card-over").click()
		   }
	}

	// set rating stars all back to white
	var stars = movieDiv.querySelectorAll(".rating" + movieDivNo + " span")
	for (var i = 0; i < stars.length; i++){
		stars[i].style.color = "white"
	}
	
	// // reset all data added in from previous film to blank in case new film doesnt contain some results and retains data from the old film
	var innerTextErase 	= [".ratingData",".trailerData", ".movieData", ".poster", ".title",
					   ".imdb", ".metacritic", ".rottenTomatoes", ".runtime", ".genre",
					   ".releaseDate", ".plot", ".actors", ".writers", ".awards",
					   ".director", ".boxoffice", ".imdbvotes"]
	
	var dataToErase		= [".ratingData", ".trailerData", ".movieData"]
	
	for(var i = 0 ; i < innerTextErase.length; i++){
		movieDiv.querySelector(innerTextErase[i] + movieDivNo).innerHTML = ""
	}
	
	for (var i = 0; i < dataToErase; i++){
		movieDiv.querySelector(dataToErase[i] + movieDivNo).value = ""
	}


	// remove classes that were such as "col-" added to outer movie div and add original classes back in
	movieDiv.setAttribute("class", "")
	// add back original classes so can be reused again
	movieDiv.classList.add("d-none", "movie" + movieDivNo ,"p-0", "movie", "mobile" + movieDivNo)
	
	// run function that adjusts spacing of divs with the new extra div
	divResize();
})


// invoking a search through selecting one of the preset movies on homepage
$(".chooseFromHome").on("click", function(){
	var data = this.parentNode.parentNode
	// some wrapping in annonymous variables to match strucutre of films selected via the autocomplete library
	var feedback = 		
		{selection: 
		 {value: 
		  {original_title: data.querySelector(".original_title").textContent.trim(),
				releaseDate: data.querySelector(".releaseDate").textContent.trim(),
				overview: data.querySelector(".overview").textContent.trim(),
				poster_path: data.querySelector(".poster_path").textContent.trim(),
				id: data.querySelector(".id").textContent.trim(),
		  }
		 }
		}
	autoCompletejs.onSelection(feedback)
})
