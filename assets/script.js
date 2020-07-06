
src="https://code.jquery.com/jquery-3.5.1.min.js"
integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
crossorigin="anonymous"

    var queryURL = "https://developers.zomato.com/api/v2.1/search?lat=" + lat + "&lon=" + long; 
    var apiKey = "b2f666e78eb609db1442ad0b8d5780e8";
    var lat; 
    var long;

$.ajax({
    method: "GET",
    url: queryURL,
    headers: {
        "user-key": apiKey,
        "content-type": "application/json"
    }
    }).then(response => {
        console.log(response);
    })

