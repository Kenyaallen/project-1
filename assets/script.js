$(document).ready(function(){

    var ZomatoAPIKey = "b2f666e78eb609db1442ad0b8d5780e8";
    // var zipCodeQueryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipCode + "&key=AIzaSyCHUllvvIE1AweiwvXJOCvxq5DmtUhv1Cw"; 
    // var latitude; 
    // var longitude;
    var zipCode; 
    // var restaurantLat; 
    // var restaurantLong; 
    var restaurantArray = []; 
    var refugeeArray= []; 
    var restaurantResponse;  
    var intersection; 

//gets the zipcode provided by the user 
function getZipCode(){ 
  $(".searchResultsArea").empty(); 
  zipCode = $(".validate").val()
  console.log("Function getZipCode returns: " + zipCode); 
  getLatLngByZipcode(); 

}

//gets the latitude and longitude using Google geolocation API and the zipcode provided by the user 
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
  
}

//Zomato API call 
function getRestaurants (latitude, longitude){
  $.ajax({
    method: "GET",
    url: "https://developers.zomato.com/api/v2.1/search?lat=" + latitude + "&lon=" + longitude + "&count=100", 
    headers: {
        "user-key": ZomatoAPIKey,
        "content-type": "application/json", 
    }
    }).then(response => {
        console.log(response); 
        restaurantResponse = response.restaurants; 
        for (i=0; i<response.restaurants.length; i++){
          restaurantArray.push(response.restaurants[i].restaurant.name); 
        }

        pullRefugeeInfo(latitude, longitude); 

    })
}    

//refugee api call 
function pullRefugeeInfo(restaurantLat, restaurantLong){
    var queryURL = "https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=20&offset=0&lat=" + restaurantLat + "&lng=" + restaurantLong;

    $.ajax({
    method: "GET",
    url: queryURL,
    headers: {
        "content-type": "application/json"
    }
    }).then(response => {   
        console.log(response);   
        refugeeResponse = response;    
        for (i=0; i<20; i++){
          refugeeArray.push(response[i].name); 
        }

        compareArrays(); 

    })
}

//compares the list of restaurants and the list of bathrooms returned with the two APIs
function compareArrays (){ 
  console.log(restaurantArray); 
  console.log(refugeeArray); 
  intersection = refugeeArray.filter(function(e) {
    return restaurantArray.indexOf(e) > -1;
  });
  console.log(intersection); 
  finalRestaurantData();

}


//displays data that appears through both Zomato and Refugee APIs
function finalRestaurantData (){
  var restaurantFinalData = restaurantResponse.filter(function(item){
    return intersection.includes(item.restaurant.name)
  })


  var refugeeFinalData = refugeeResponse.filter(function(item){
      return intersection.includes(item.name)

  })
  console.log(restaurantFinalData)
  console.log(refugeeFinalData)

  if (intersection.length === 0) { 
    var norestaurants = $("<div>"); 
    norestaurants.text("No restaurants fit your criteria, please try again.");  
    $(".searchResultsArea").append(norestaurants);
    return; 

  }
  else { 

      for (i=0; i<intersection.length; i++){ 

        var restaurant = $("<div>"); 
        restaurant.text(intersection[i]);
        restaurant.attr("class", "restaurantResult")  

        var foodStyle = $("<div>"); 
        foodStyle.html("<strong>Cuisine: </strong>"+ restaurantFinalData[i].restaurant.cuisines); 
        var address = $("<div>"); 
        address.html("<strong>Location: </strong>" + restaurantFinalData[i].restaurant.location.address); 
        var accessible = $("<div>"); 
        if (refugeeFinalData[i].accessible ===true){ 
          accessible.text("Handicap accessible"); 
        }
        else { 
          accessible.text("Not handicap accessible"); 
        }

        var unisex = $("<div>"); 
        if (refugeeFinalData[i].unisex ===true){ 
          unisex.html("Unisex bathroom option"); 
        }
        else { 
          unisex.html("No unisex bathroom option"); 
        }

        var restaurantURL = $("<div>"); 
        restaurantURL.html("<strong><a href=" + restaurantFinalData[i].restaurant.url + ">More info</a></strong>"); 


        $(".searchResultsArea").append(restaurant);
        $(".searchResultsArea").append(foodStyle); 
        $(".searchResultsArea").append(address); 
        $(".searchResultsArea").append(accessible); 
        $(".searchResultsArea").append(unisex);
        $(".searchResultsArea").append(restaurantURL);



      }
    }
}


$("#searchBtn").on("click", getZipCode)

}); 
