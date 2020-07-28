// for ading new div logic. Will need to be reset when a movie is unselected in the future
var currentDiv  = 1
var noMovies	= 0

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

		// API CALL TO BRING IN MORE MOVIE DATA ON MOVIE SELECTED
		async function getMovieData() {
		// movieData 		= [];
		var imdbID 		= feedback.selection.value.imdbID;
		let response 	= await fetch("https://www.omdbapi.com/?i=" + imdbID + "&apikey=thewdb");
		let data		= await response.json();
		return data;
		}
		
		// logic to choose which div content is going in on the page
		var isImg = document.querySelector("IMG")

		for (var q = 1; q <= 4; q++){
				if (!document.querySelector(".poster" + q).contains(isImg)){
				break
				}
				else{
					currentDiv ++
				}
		}

		// unhide current div if currently hidden
		document.querySelector(".movie" + currentDiv).classList.remove("d-none");
		
		// count number of movies currently showing
		activeDivs = []
		for(var i = 1; i <= 4; i++){
			if(!document.querySelector(".movie" + i).classList.contains("d-none")){
				activeDivs.push(".movie" + i)
				noMovies ++
			}
				
		}
		
		var classToDelete = ""
		var findSize = document.querySelector(activeDivs[0]).classList
		
		for (var k = 0; k < findSize.length; k++){
			if(findSize[k].includes("col-")){
				classToDelete = findSize[k]
				break
			}
		}		
		
		for(var n = 0; n < activeDivs.length; n++){
			if(classToDelete){
				document.querySelector(activeDivs[n]).classList.remove(classToDelete)
				document.querySelector(activeDivs[n]).classList.add("col-" + (12/noMovies))
			}
			else{
				document.querySelector(activeDivs[n]).classList.add("col-" + (12/noMovies))
			}
			
		}

		// Render all movie info to correct div
		getMovieData().then(function(result) {
			// var smallerPoster = result.Poster.substr(0,result.Poster.length - 7) + "200.jpg"
			document.querySelector(".poster" + currentDiv).innerHTML				= "<img  src = '" + result.Poster + "'>"
			document.querySelector(".title" + currentDiv).innerHTML					= result.Title
			document.querySelector(".imdb" + currentDiv).innerHTML					= "<strong>imdb Rating:</strong>&nbsp;" + result.Ratings[0].Value
			document.querySelector(".metacritic" + currentDiv).innerHTML			= "<strong>Metacritic Rating:</strong>&nbsp;" + result.Ratings[1].Value
			document.querySelector(".rottenTomatoes" + currentDiv).innerHTML		= "<strong>Rotten Tomatoes:</strong>&nbsp;" + result.Ratings[2].Value
			document.querySelector(".runtime" + currentDiv).innerHTML 				= "<strong>Movie Length:</strong>&nbsp;" + result.Runtime
			document.querySelector(".genre" + currentDiv).innerHTML 				= "<strong>Genre:</strong>&nbsp;" + result.Genre
			document.querySelector(".releaseDate" + currentDiv).innerHTML 			= "<strong>Release Date:</strong>&nbsp;" + result.Released
		});
		
		// Clear Input
		document.querySelector("#autoComplete").value = "";

		noMovies   = 0
	}
});
// class='img-fluid' alt='Responsive image'
// Toggle event for search input
// showing & hidding results list onfocus / blur
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

// event listener to remove div when delete button clicked
$("div").on("click", "div div .btn-danger", function(){
	var parentDiv = this.parentNode.parentNode.parentNode;

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
	
	// delete img so earlier logic works
	movieDiv.childNodes[1].innerText = ""
	console.log(movieDiv.childNodes[1])
	// remove classes added to outer movie div and add original classes back in
	this.parentNode.parentNode.setAttribute("class", "")
	this.parentNode.parentNode.classList.add("d-none", "movie" + numberSearch ,"p-0")
	

	
	currentDiv = 1

})


