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

// logic for show more button on user sandpit
// When the user clicks on the see more button underneath or in the image, open the modal
var currentModal = {}
$(".card").on("click",".myBtn", function(){
	var modal = this.parentNode.querySelector(".modal")
	modal.style.display = "block"
	currentModal = modal
	console.log(modal)
})

$(".middleText").on("click", function(){
	var movieCard = this.parentNode.parentNode.parentNode;
	var modal = movieCard.querySelector(".modal")
	modal.style.display = "block"
	currentModal = modal
})

$(".card").on("click",".close", function(){
	this.parentNode.parentNode.parentNode.style.display = "none";
	// delete current modal selected
	for (var member in currentModal) delete currentModal[member];
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == currentModal) {
	// delete current modal selected
	for (var member in currentModal) delete currentModal[member];
    currentModal.style.display = "none";
  }
}

// functioality to flip movie poster on homepage
$('.turn-card-over').click(function() {
	movieDiv = this.parentNode
	movieDiv.querySelector(".flip-card-inner").classList.toggle("active")
});
