var searchFormEl = document.querySelector("#search-form");
var searchCityEl = document.querySelector("#search-city");

var searchResultsEl = document.querySelector("#results");


var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityName = searchCityEl.value.trim();
    getLonLat(cityName);
}

var getLonLat = function(cityName) {
    var apiUrl = "https://geocode.xyz/" + cityName + "?json=1&auth=163611677966105275686x24104";

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getWeather(data.latt, data.longt, cityName);
            });
        } else {
            alert("Error: City Not Found");
        }
    })
    .catch(function(error) {
        // catch server error
        alert("Unable to connect to server");
    })
}

var getWeather = function(lat, lon, cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=529ec8fe3b43964d9f7c544819c519d6";

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                showWeather(data, cityName);
            });
        } else {
            alert("Error: City Not Found");
        }
    })
    .catch(function(error) {
        // catch server error
        alert("Unable to connect to server");
    })
}

var getDate = function(timestamp) {
    var theDate = new Date(timestamp * 1000).toLocaleDateString('en-US');
    return theDate;
}

var showWeather = function(data, cityName) {
    var dateVal = getDate(data.current.dt);
    console.log(cityName, dateVal, data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi)
    var currentWeatherEl = document.createElement("div");
    var cityEl = document.createElement("h2");
    cityEl.innerText = cityName + " (" + dateVal + ") ";

    currentWeatherEl.appendChild(cityEl);

    for (var i = 1; i< 6; i++) {
        var dateVal = getDate(data.daily[i].dt);
        console.log(dateVal, data.daily[i].temp.day, data.daily[i].wind_speed, data.daily[i].humidity)
    }

    searchResultsEl.appendChild(currentWeatherEl);
}

searchFormEl.addEventListener("submit", formSubmitHandler);

// geocode api call https://geocode.xyz/Atlanta?json=1&auth=163611677966105275686x24104

// open weather map api call  https://api.openweathermap.org/data/2.5/onecall?lat=33.79&lon=-84.44&exclude=minutely,hourly&units=imperial&appid=529ec8fe3b43964d9f7c544819c519d6