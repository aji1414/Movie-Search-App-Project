// autoComplete.js on typing event emitter
document.querySelector("#autoComplete").addEventListener("autoComplete", event => {
	// console.log(event);
});

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
		
		const selection = feedback.selection.value.Title;
		const poster = feedback.selection.value.Poster;
		
		// unhide current div if currently hidden
		document.querySelector(".movie" + currentDiv).classList.remove("d-none");
		
				
		
		
		
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
		document.querySelector(".selection" + currentDiv).innerHTML =  selection;
		document.querySelector(".poster" + currentDiv).innerHTML = "<img class='img-fluid' alt='Responsive image' src = '" + poster + "'>";
		
		
		
		
		// Clear Input
		document.querySelector("#autoComplete").value = "";
		// Change placeholder with the selected value
		document
			.querySelector("#autoComplete")
			.setAttribute("placeholder", selection);
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


