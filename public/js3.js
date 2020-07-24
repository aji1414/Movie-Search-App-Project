// var movies = [];
// var comeThrough = []


// async function getMovies() {
// 	var movieSearched = $("#myInput").val()
// 	let response = await fetch("https://www.omdbapi.com/?s=" + movieSearched + "&apikey=thewdb")
// 		// "https://api.themoviedb.org/3/search/movie?api_key=64436a1714ae913f7d6492fd1433610c&query=" + movieSearched)
// 	let data     = await response.json()
// 	movies = []
// 	for (var i = 0;i < 50; i++){
// 		// // pull url of poster for each movie
// 		// var posterPath = data.Search[i].poster_path;
		
// 		var add = [data.Search[i].Title,
// 				   data.Search[i].Poster,
// 				  data.Search[i].imdbID];
// 		movies.push(add);
// 		// console.log("movie pushed: " + add[0])
// 	}
	
// 	// console.log("this is the ting " + movies[1])
// 	console.log(movies)
// 	return movies;
// }

// ////////////////////////////////////////////////////////////////////





// //////////////////////////////////////////////////////
// function autocomplete(inp, arr) {
//   /*the autocomplete function takes two arguments,
//   the text field element and an array of possible autocompleted values:*/
//   var currentFocus;
//   /*execute a function when someone writes in the text field:*/
//   inp.addEventListener("input", function(e) {
// 	  console.log("event triggered")
// 	  closeAllLists();
// 	  // api call on searched movie
// 	  getMovies();
// 	// update movie array to latest api call results
// 	  arr = movies
// 	console.log("movies to check " + movies)
// 	  console.log("array length is " + arr.length)
// 	  var a, b, i, val = this.value;

	  
//       if (!val) { return false;}
//       currentFocus = - 1;
	  
//       /*create a DIV element that will contain the items (values):*/
//       a = document.createElement("DIV");
//       a.setAttribute("id", this.id + "autocomplete-list");
//       a.setAttribute("class", "autocomplete-items");
	  
	  

//       /*append the DIV element as a child of the autocomplete container:*/
//       this.parentNode.appendChild(a);
//       /*for each item in the array...*/
	  
// 	  for (i = 0; i < arr.length; i++) {
// 		/*check if the item starts with the same letters as the text field value:*/
// 		  var currentMovieParse = arr[i][0].substr(0, arr[i][0].length - 2);
// 		  currentMovieParse = currentMovieParse.toUpperCase();
		  
// 		  var comeThrough = arr[i]
// 		  // console.log(comeThrough)
// // 		  if statement to return only results from API which actually include the current input value. As API search isn't based on just exact matches
// 		console.log(arr[i][0] + " " + currentMovieParse)
// 		if (currentMovieParse.includes(val.toUpperCase()) === true) {
// 			console.log("works")
		
// 		  /*create a DIV element for each matching element:*/
// 		  b = document.createElement("DIV");
// 		  /*make the matching letters bold:*/
// 		  b.innerHTML = "<strong>" + arr[i][0].substr(0, val.length) + "</strong>";
// 		  // added the image tag of movie to appear alongside name in search bar
// 		  b.innerHTML += arr[i][0].substr(val.length) + "<img class = 'ml-3 poster' src = " + arr[i][1] + ">";
// 		  /*insert a input field that will hold the current array item's value:*/
// 		  b.innerHTML += "<input type='hidden' filmName='" + arr[i][0] + "' poster='" + arr[i][1] + "' id='" + arr[i][2] + "'>";

// 		  /*execute a function when someone clicks on the item value (DIV element):*/
// 			  b.addEventListener("click", function(e) {
// 			  /*insert the value for the autocomplete text field:*/
// 			  // inp.value = this.getElementsByTagName("input")[0].value;
// 			inp.value = this.getElementsByTagName("input")[0].getAttribute("filmName");
						  
// 			// create new div element on screen with chosen film
// 			// outer new div element for entire movie	  
// 			var newDiv = document.createElement("DIV")
			
// 			// <img src="..." class="img-fluid" alt="Responsive image">
			
// 			// create movie thumbnail
// 			var newThumbnail = document.createElement("img")
// 			newThumbnail.setAttribute("src", this.getElementsByTagName("input")[0].getAttribute("poster") )
			
// 			// create movie header
// 			var divH1  = document.createElement("H1")
// 			divH1.innerHTML = inp.value
// 			divH1.classList.add("testing")
			
// 			// put all created elements within movie div
// 			newDiv.appendChild(newThumbnail)
// 			newDiv.appendChild(divH1)
			
				  
// 			// put movie div in pre set movie div
// 			var current = document.querySelector("#movieSpace")
// 			current.appendChild(newDiv)
			
				
// 			  /*close the list of autocompleted values,(or any other open lists of autocompleted values:*/
// 			  closeAllLists();
// 		  });
// 		  a.appendChild(b);
		  
// 		}
// 		 else{
// 			 console.log("dont work")
// 		 }
	
// 	  }
 
// 	  // console.log("this is a,b,i,val: " + a + " " + b + " " + i + " " + val)
//   });
//   /*execute a function presses a key on the keyboard:*/
//   inp.addEventListener("keydown", function(e) {
//       var x = document.getElementById(this.id + "autocomplete-list");
//       if (x) x = x.getElementsByTagName("div");
//       if (e.keyCode == 40) {
//         /*If the arrow DOWN key is pressed,
//         increase the currentFocus variable:*/
//         currentFocus++;
//         /*and and make the current item more visible:*/
//         addActive(x);
//       } else if (e.keyCode == 38) { //up
//         /*If the arrow UP key is pressed,
//         decrease the currentFocus variable:*/
//         currentFocus--;
//         /*and and make the current item more visible:*/
//         addActive(x);
//       } else if (e.keyCode == 13) {
//         /*If the ENTER key is pressed, prevent the form from being submitted,*/
//         e.preventDefault();
//         if (currentFocus > -1) {
//           /*and simulate a click on the "active" item:*/
//           if (x) x[currentFocus].click();
//         }
//       }
//   });
//   function addActive(x) {
//     /*a function to classify an item as "active":*/
//     if (!x) return false;
//     /*start by removing the "active" class on all items:*/
//     removeActive(x);
//     if (currentFocus >= x.length) currentFocus = 0;
//     if (currentFocus < 0) currentFocus = (x.length - 1);
//     /*add class "autocomplete-active":*/
//     x[currentFocus].classList.add("autocomplete-active");
//   }
//   function removeActive(x) {
//     /*a function to remove the "active" class from all autocomplete items:*/
//     for (var i = 0; i < x.length; i++) {
//       x[i].classList.remove("autocomplete-active");
//     }
//   }
//   function closeAllLists(elmnt) {
//     /*close all autocomplete lists in the document,
//     except the one passed as an argument:*/
//     var x = document.getElementsByClassName("autocomplete-items");
//     for (var i = 0; i < x.length; i++) {
//       if (elmnt != x[i] && elmnt != inp) {
//       x[i].parentNode.removeChild(x[i]);
//     }
//   }
// }
// /*execute a function when someone clicks in the document:*/
// document.addEventListener("click", function (e) {
//     closeAllLists(e.target);
// });
// }


// autocomplete(document.getElementById("myInput"), movies);



// // var axios = require("axios");


// // var request = new XMLHttpRequest()
// // var url = "https://files.tmdb.org/p/exports/movie_ids_06_30_2020.json.gz" 


// // fix issue funciton
// function fix(needsfix){
// 		var output = ""

// 		for(var i = 0; i <needsfix.length; i++){
// 			console.log(needsfix.length)
// 			if (needsfix.charCodeAt(i) <= 127){
// 				output += needsfix.charAt(i)
// 			}
// 		}
// 		console.log(output.length)
		
// 	}



