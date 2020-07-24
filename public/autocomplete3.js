// autoComplete.js on typing event emitter
document.querySelector("#autoComplete").addEventListener("autoComplete", event => {
	// console.log(event);
});

var request = new XMLHttpRequest()


// for ading new div logic. Will need to be reset when a movie is unselected in the future
var currentDiv = 1


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
				"https://www.omdbapi.com/?s=" + movieSearched + "&apikey=thewdb"
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
		var movieData 	= [];
		// API CALL TO BRING IN MORE MOVIE DATA ON MOVIE SELECTED
		// var movieData = {}
		var imdbID 		= feedback.selection.value.imdbID;
	    var response 	= "https://www.omdbapi.com/?i=" + imdbID + "&apikey=thewdb";

		async function getMovieData() {
		// movieData 		= [];
		var imdbID 		= feedback.selection.value.imdbID;
		let response 	= await fetch("https://www.omdbapi.com/?i=" + imdbID + "&apikey=thewdb");
		let data		= await response.json();
		// movieData.push(data);
		return data;
		}
		
		
		// var test = await getMovieData();
		// console.log(getMovieData())
		// console.log(movieData)
		
		// getMovieData().then(function(result){
		// 	console.log(result)
		// 	return result
		// })
		
		// console.log(movieData)
// 		let userToken = AuthUser(data)
// 		console.log(userToken) // Promise { <pending> }

// 		userToken.then(function(result) {
// 		   console.log(result) // "Some User token"
// 		})
		
		// (async () => {
		//   console.log(await getMovieData())
		// })()
		
		// console.log(movieData)
		
		// var movieData  = getMovieData();
		
		// console.log(typeof movieData)
		// console.log(movieData)
		// console.log("runtime is " + movieData)
		// logic to choose which div content is going in on the page
		var isImg = document.querySelector("img")

		for (var num = 1; num < 6; num++){
			// var currentCheck = document.querySelector(".selection" + num)
			if (document.querySelector(".poster" + num).contains(isImg)){
				currentDiv ++
			}
			else{
				break 
			}
		}
		
		const title = feedback.selection.value.Title;
		const poster = feedback.selection.value.Poster;
		
		// unhide current div if currently hidden
		document.querySelector(".movie" + currentDiv).classList.remove("d-none");
		
				
		// ADD COMMENTS EXPLAINING ALL THE FOLLOWING CODE
		
		
		for (var i = 1; i <= currentDiv; i++){
			var currentClasses = []
			var classList = document.querySelector(".movie" + i).classList
			
			for (var j = 0; j < classList.length; j ++) {
				currentClasses.push(classList[j])
			}
		
			
			var classToDelete = ""
			
			for (var k = 0; k < currentClasses.length; k++){
				if(currentClasses[k].includes("col-")){
				   classToDelete = currentClasses[k]
				}
			}
			// console.log(classToDelete)
			
			if(classToDelete){
				document.querySelector(".movie" + i).classList.remove(classToDelete)
			}
			
			document.querySelector(".movie" + i).classList.add("col-" + (12/currentDiv))
		}
		
		
		// Render selected choice to selection div
		document.querySelector(".title" + currentDiv).innerHTML =  title;
		document.querySelector(".poster" + currentDiv).innerHTML = "<img class='img-fluid' alt='Responsive image' src = '" + poster + "'>";
		getMovieData().then(function(result) {
			document.querySelector(".runtime" + currentDiv).innerHTML = result.Runtime
		});
		
		// document.querySelector(".runtime" + currentDiv).innerHTML =  getMovieData().then(function(result){
		// 																					return result
		// 																				})
			// movieData.Runtime;		
		
		// Clear Input
		document.querySelector("#autoComplete").value = "";
		// Change placeholder with the selected value
		document
			.querySelector("#autoComplete")
			.setAttribute("placeholder", title);
		// Concole log autoComplete data feedback
		// console.log(feedback);
	}
});

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


