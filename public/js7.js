// logic to hide/display input box depending on url of page
if (window.location.pathname !== '/') {
    $("#autoComplete").hide()
}

// click listeners to change review value and update in HTML form
for (var h = 1; h <= 4; h++){
	$(".rating" + h).on("click", "span", function() {
		
		// $(this).css("background-color", "blue");
		var allSpans = this.parentNode.querySelectorAll("span")

		// number/rank of the star selected
		var starNoSelected = $(this).index()

		for(var j = 0; j < allSpans.length; j++){
			allSpans[j].style.color = "white"
		}

		// reverse because of the logic in the css sheet to be able to highlight consecutive stars
		for (var i = 4; i >= starNoSelected; i--){
			allSpans[i].style.color = "blue"
		}
		
		// count how many stars user rated film and store the new star value in html doc
		var starCount = 0
		for (var i = 0; i < allSpans.length; i++){
			if(allSpans[i].style.color === "blue"){
				starCount ++
			}
		}
		
		// find the current movie div as variable h above cant be accessed
		var allMovieDivs = this.parentNode.parentNode.parentNode
		var index = $(".movie").index(allMovieDivs) + 1
		
		allMovieDivs.querySelector(".ratingData" + index).value = starCount
		});
}

