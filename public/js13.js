// logic to hide/display input box depending on url of page
// if (window.location.pathname !== '/') {
//     $("#autoComplete").hide()
// }

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
	var modal = this.parentNode.querySelector(".modal2")
	modal.style.display = "block"
	currentModal = modal
	console.log(modal)
})

$(".middleText").on("click", function(){
	var movieCard = this.parentNode.parentNode.parentNode;
	var modal = movieCard.querySelector(".modal2")
	modal.style.display = "block"
	currentModal = modal
})

$(".testModal").on("click", function(){
	var movieCard = this.parentNode;
	var modal = movieCard.querySelector(".modal2")
	modal.style.display = "block"
	currentModal = modal
})

$(".card").on("click",".close", function(){
	// stop trailer from playing if it is
	currentModal.querySelector("iframe").src = ""
	// exit modal
	currentModal.style.display = "none";

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
	movieDiv.querySelector("iframe").classList.toggle("d-none")
});

// button to unhide change rating sandpitpit
$(".changeRating").click(function(){
	var main = this.parentNode
	main.querySelector("button[type=submit]").classList.toggle("d-none")
	main.querySelector(".inlineFormCustomSelectPref").classList.toggle("d-none")
});

// confirm with user if they want to delete movie. If no clicked, simply toggle modal off. If yes clicked, then submit the form.
$('.movieRemoveForm').submit(function(event){
  event.preventDefault();
  var main = this.parentNode;
  $(main).find(".removeMovieModal").modal('toggle')
 })

$(".removeMovieNo").on("click", function(){
	var movie = this.parentNode.parentNode.parentNode.parentNode.parentNode
	$(movie).find('.removeMovieModal').modal('toggle')
})

$(".removeMovieYes").on("click", function(){
	var movie = this.parentNode.parentNode.parentNode.parentNode.parentNode
	movie.querySelector(".movieRemoveForm").submit()
})

// show password function on sign homepageage
function showPassword(){
	var password = document.querySelectorAll(".password")
	if (password[0].type === "password"){
		for (i = 0; i < password.length; i++){
		password[i].type = "text"
		}
	}
	else{
		for (i = 0; i < password.length; i++){
		password[i].type = "password"
		}	
	}
}

// when user clicks a film/show on front page
// $(".hoverHand2").click(function(){
// 	console.log("triggered")
// 	// console.log(this.textContent)
// 	document.querySelector("#autoComplete").value = this.textContent.trim()
// })


