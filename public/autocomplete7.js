// stores current colwidth for div to be used upon creation and deletion of new movies
var colWidth = ""

// function which counts current active divs. To stop user 
function divCount(){
	noMovies = 0
	for(var i = 1; i <= 4; i++){
			if(!document.querySelector(".movie" + i).classList.contains("d-none")){
				noMovies ++
			}	
		}
	return noMovies
}

// function to resize divs when new movies added or old ones deleted
function divResize(countOnly){
	// find current divs showing on screen
		activeDivs 	= 	[];
		noMovies	=	0;
		for(var i = 1; i <= 4; i++){
			if(!document.querySelector(".movie" + i).classList.contains("d-none")){
				activeDivs.push(".movie" + i)
				noMovies ++
			}	
		}
	
	oldColWidth			= colWidth		
	colWidth 			= "col-" + (12/noMovies)

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
				// separrate fetch statement to also pull in series, then concatenate the data for both in one json object
				// prob better to just look for one online solution where you can write it in a single line
				"https://www.omdbapi.com/?s=" + movieSearched + "&type=movie&apikey=thewdb"
			);
			const data = await source.json();
			// Post loading placeholder text
			document
				.querySelector("#autoComplete")
				.setAttribute("placeholder", "Search Movies");
			// Returns Fetched data
			return data.Search;
		},
		
		key: ["Title", "Year", "imdbID", "Type", "Poster"],
		cache: false
	},
	sort: (a, b) => {
		if (a.match < b.match) return -1;
		if (a.match > b.match) return 1;
		return 0;
	},
	placeHolder: "Search Movies",
	selector: "#autoComplete",
	threshold: 0,
	debounce: 0,
	searchEngine: "loose",
	highlight: true,
	maxResults: 100,
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
		// alert for when already chosen 4 movies
		if(divCount() === 4){
			alert("No more movies allowed!")
		}
		else{
			// resets div to change variable to 1
			var divToChange	= 1
			// console.log("on click is " + divToChange)

			// logic to choose in which div new movie will go into on page. Checks if there is an image already in each div
			// if there is an image, there is already a movie in that slot
			for (var q = 1; q <= 4; q++){
					if (document.querySelector(".poster" + q).childNodes.length !== 1){
					break
					}
					else{
						divToChange ++
					}
			}
			
			// unhide div selected
			document.querySelector(".movie" + divToChange).classList.remove("d-none");

			// run function that adjusts spacing of divs with the new extra div
			divResize();

			// API CALL TO BRING IN MORE MOVIE DATA ON MOVIE SELECTED
			async function getMovieData() {
			var imdbID 		= feedback.selection.value.imdbID;
			let response 	= await fetch("https://www.omdbapi.com/?i=" + imdbID + "&apikey=thewdb");
			let data		= await response.json();
			return data;
			}
		
			// api call for movie trailer. Had to do separate to stuff below due to scoping issues as they use different sources
			movieTrailer(feedback.selection.value.Title, {id: true, multi: true}).then(function(result){
				// result.length - 1 is to select the last entry in the array as this is the most up to date trailer
				// document.querySelector(".trailer" + divToChange).value 	= result[result.length - 1]
				document.querySelector(".trailer" + divToChange).value 	= result[0]
				// document.querySelector(".trailer" + divToChange).setAttribute("src","https://www.youtube-nocookie.com/embed/" + result[result.length - 1])
				document.querySelector(".trailer" + divToChange).setAttribute("src","https://www.youtube-nocookie.com/embed/" + result[0])
			})
						
			// Render all movie info to correct div
			getMovieData().then(function(result) {
				// Render page elements
				document.querySelector(".poster" + divToChange).innerHTML				= "<img  src = '" + result.Poster + "'>"
				document.querySelector(".title" + divToChange).innerHTML				= result.Title
				document.querySelector(".imdb" + divToChange).innerHTML					= "<strong>imdb Rating:</strong>&nbsp;" + result.Ratings[0].Value
				document.querySelector(".metacritic" + divToChange).innerHTML			= "<strong>Metacritic Rating:</strong>&nbsp;" + result.Ratings[1].Value
				document.querySelector(".rottenTomatoes" + divToChange).innerHTML		= "<strong>Rotten Tomatoes:</strong>&nbsp;" + result.Ratings[2].Value
				document.querySelector(".runtime" + divToChange).innerHTML 				= "<strong>Movie Length:</strong>&nbsp;" + result.Runtime
				document.querySelector(".genre" + divToChange).innerHTML 				= "<strong>Genre:</strong>&nbsp;" + result.Genre
				document.querySelector(".releaseDate" + divToChange).innerHTML 			= "<strong>Release Date:</strong>&nbsp;" + result.Released
				
				// set background of div to be movie poster
				// var biggerPoster = result.Poster.substr(0, result.Poster.length - 7) + "800.jpg"
				// var domElement 						= document.querySelector(".movie" + divToChange).style
				// domElement.background 				= "url(" + biggerPoster + ")"
				// domElement.backgroundRepeat 		= "no-repeat"
				// domElement.backgroundPosition 		= "center center"
				// domElement.backgroundSize 			= "contain"
				
				
				// store all movie data to put in users sandpit. Pass through to HTML document
				document.querySelector(".movieData" + divToChange).value 				= JSON.stringify(result)
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
$("div").on("click", "div div .btn-danger", function(){
	var parentDiv = this.parentNode.parentNode.parentNode;

	
	// stop movie trailer by simply resetting source link to blank
	var trailer = this.parentNode.parentNode.querySelector("iframe")
	trailer.setAttribute("src","")
	
	// find number of current movie div
	var currentClasses = [];
	var movieDiv = this.parentNode.parentNode
	for (var i = 0; i < movieDiv.classList.length; i++){
		currentClasses.push(movieDiv.classList[i]);
	}
	
	var numberSearch = 0
	
	for(var j = 0; j < currentClasses.length; j++){
		if (currentClasses[j].includes("movie")){
			// 5 is where the number is stored in the string in the class name
			numberSearch = currentClasses[j][5]
			break
			}
	}
	
	// delete img so earlier logic on which div to use when adding new movie works
	movieDiv.childNodes[1].innerText = ""
	// remove classes that were such as "col-" added to outer movie div and add original classes back in
	this.parentNode.parentNode.setAttribute("class", "")
	// add back original classes so can be reused again
	this.parentNode.parentNode.classList.add("d-none", "movie" + numberSearch ,"p-0")
	
	// run function that adjusts spacing of divs with the new extra div
	divResize();
})

