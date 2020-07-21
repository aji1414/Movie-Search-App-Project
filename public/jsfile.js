var movies = [];

// now adapted for autocompplete search
async function getMovies() {
	var movieSearched = $("#myInput").val()
	let response = await fetch("https://api.themoviedb.org/3/search/movie?api_key=64436a1714ae913f7d6492fd1433610c&query=" + movieSearched)
	let data     = await response.json()
	// console.log(data.results[0])
	movies = []
	for (var i = 0;i < 50; i++){
		var add = data.results[i].title;
		movies.push(add);
	}
	
	return movies;
}


// function getMovies2(){
// 	var movieSearched = $("#myInput").val()
// 	movies = []
// 	request.open('GET', "https://api.themoviedb.org/3/search/movie?api_key=64436a1714ae913f7d6492fd1433610c&query=" + movieSearched, true)
// 	request.onload = function () {
// 	  // Begin accessing JSON data here
// 	  var data = JSON.parse(this.response)

// 	  if (request.status >= 200 && request.status < 400) {
// 		// console.log(data.results[0].title)
// 		for (var i = 0; i < 50; i++){
// 			movies.push(data.results[i].title)
// 		} 

// 		return movies
// 	  } else {
// 		console.log('error')
// 		}	
// }

// request.send()

// }


// deleted code that may be needed to be reinserted
// if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase())

// document.getElementById("fname").addEventListener("change", myFunction);
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
	  closeAllLists();
	  // api call on searched movie
	  getMovies();
	// update movie array to latest api call results
	  arr = movies
	  console.log(this.value + "this is it")
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      // closeAllLists();
      if (!val) { return false;}
      currentFocus = - 1;
	  
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
	  
	  

      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
// 	  i < arr.length
	  // console.log(val)
	  // console.log("come through? " + movies)
	  // .toUpperCase()
	  
	  for (i = 0; i < arr.length; i++) {
		/*check if the item starts with the same letters as the text field value:*/
		  var currentMovieParse = arr[i].toUpperCase();
// 		  if statement to return only results from API which actually include the current input value. As API search isn't based on just exact matches
		if (currentMovieParse.includes(val.toUpperCase()) === true) {
			console.log(currentMovieParse + " " + val.toUpperCase())
		
			
		  /*create a DIV element for each matching element:*/
		  b = document.createElement("DIV");
		  /*make the matching letters bold:*/
		  b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
		  // added the image tag of movie to appear alongside name in search bar
		  b.innerHTML += arr[i].substr(val.length) + "<img class = 'ml-3' src = 'https://image.tmdb.org/t/p/w92/8RW2runSEc34IwKN2D1aPcJd2UL.jpg'>";
		  /*insert a input field that will hold the current array item's value:*/
		  b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
			
		
			
		  /*execute a function when someone clicks on the item value (DIV element):*/
			  b.addEventListener("click", function(e) {
			  /*insert the value for the autocomplete text field:*/
			  inp.value = this.getElementsByTagName("input")[0].value;
				  
			  // create new div element on screen with chosen film
			var newDiv = document.createElement("DIV")
			var inside = document.createTextNode(("Testing if it works"))
			newDiv.appendChild(inside)
			var current = document.querySelector("#movieSpace")
			current.appendChild(newDiv)
			
				
			  /*close the list of autocompleted values,(or any other open lists of autocompleted values:*/
			  closeAllLists();
		  });
		  a.appendChild(b);
		  
		}
	  }
 
	  console.log("this is a,b,i,val: " + a + " " + b + " " + i + " " + val)
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}


autocomplete(document.getElementById("myInput"), movies);



// var axios = require("axios");


// var request = new XMLHttpRequest()
// var url = "https://files.tmdb.org/p/exports/movie_ids_06_30_2020.json.gz" 


// fix issue funciton
function fix(needsfix){
		var output = ""

		for(var i = 0; i <needsfix.length; i++){
			console.log(needsfix.length)
			if (needsfix.charCodeAt(i) <= 127){
				output += needsfix.charAt(i)
			}
		}
		console.log(output.length)
		
	}



