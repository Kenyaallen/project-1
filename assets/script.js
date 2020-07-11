$(document).ready(function(){

    var ZomatoAPIKey = "b2f666e78eb609db1442ad0b8d5780e8";
    // var zipCodeQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipCode + "&key=AIzaSyCHUllvvIE1AweiwvXJOCvxq5DmtUhv1Cw"; 
    // var latitude; 
    // var longitude;
    var zipCode; 
    var restaurantLat; 
    var restaurantLong; 

function getZipCode(){ 
  zipCode = $(".validate").val()
  console.log("Function getZipCode returns: " + zipCode); 
  getLatLngByZipcode(); 

}

function getLatLngByZipcode() {
  $.ajax({
    method: "GET", 
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipCode + "&key=AIzaSyCHUllvvIE1AweiwvXJOCvxq5DmtUhv1Cw",
   
  }).then(response =>{
    console.log(response); 
    latitude = response.results[0].geometry.location.lat; 
    longitude = response.results[0].geometry.location.lng; 
    console.log(latitude, longitude); 
    getRestaurants(latitude, longitude); 
  })

  // pullRefugeeInfo(); 
  
}

function getRestaurants (latitude, longitude){
  $.ajax({
    method: "GET",
    url: "https://developers.zomato.com/api/v2.1/search?lat=" + latitude + "&lon=" + longitude, 
    headers: {
        "user-key": ZomatoAPIKey,
        "content-type": "application/json"
    }
    }).then(response => {
        // console.log(response);
        console.log(response); 
        displayRestaurants(response); 
    })
}    

function displayRestaurants (response){ 
  for (i=0; i<10; i++){
    var restaurant = $("<div>");
    // var restaurantBtn = $("<button>") 
    // restaurantBtn.attr("class", "btn-floating btn-small waves-effect waves-light"); 
    // restaurantBtn.attr("lat", response.restaurants[i].restaurant.location.latitude); 
    // restaurantBtn.attr("long", response.restaurants[i].restaurant.location.longitude); 
    restaurant.attr("lat", response.restaurants[i].restaurant.location.latitude); 
    restaurant.attr("long", response.restaurants[i].restaurant.location.longitude); 
    restaurant.html(response.restaurants[i].restaurant.name);  
    var restaurantLat = response.restaurants[i].restaurant.location.latitude; 
    var restaurantLong = response.restaurants[i].restaurant.location.longitude; 
    $(".searchResultsArea").append(restaurant);
    // restaurant.append(restaurantBtn); 
    pullRefugeeInfo(restaurantLat, restaurantLong); 
    
  }
}

//refugee api call 
function pullRefugeeInfo(restaurantLat, restaurantLong){
    var queryURL = "https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&offset=0&lat=" + restaurantLat + "&lng=" + restaurantLong;

    $.ajax({
    method: "GET",
    url: queryURL,
    headers: {
        "content-type": "application/json"
    }
    }).then(response => {
        console.log(response)


    })
}


$("#searchBtn").on("click", getZipCode)

//not yet functional - need class or ID of each individual restaurant search result button 
//$("add class or ID here").on("click", pullRefugeeInfo)

}); 





// //map search api 
//       // Note: This example requires that you consent to location sharing when
//       // prompted by your browser. If you see the error "The Geolocation service
//       // failed.", it means you probably did not give permission for the browser to
//       // locate you.
//       var map, infoWindow;
//       function initMap() {
//         map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: -34.397, lng: 150.644},
//           zoom: 6
//         });
//         infoWindow = new google.maps.InfoWindow;

//         // Try HTML5 geolocation.
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(function(position) {
//             var pos = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude
//             };

//             infoWindow.setPosition(pos);
//             infoWindow.setContent('Location found.');
//             infoWindow.open(map);
//             map.setCenter(pos);
//           }, function() {
//             handleLocationError(true, infoWindow, map.getCenter());
//           });
//         } else {
//           // Browser doesn't support Geolocation
//           handleLocationError(false, infoWindow, map.getCenter());
//         }
//       }

//       function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//         infoWindow.setPosition(pos);
//         infoWindow.setContent(browserHasGeolocation ?
//                               'Error: The Geolocation service failed.' :
//                               'Error: Your browser doesn\'t support geolocation.');
//         infoWindow.open(map);
//       }