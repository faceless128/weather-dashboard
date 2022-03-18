// set up global variables
var searchFormEl = document.querySelector("#search-form");
var searchCityEl = document.querySelector("#search-city");

var searchResultsEl = document.querySelector("#results");

// capture search input
var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = searchCityEl.value.trim();
    if (cityName) {
        getLonLat(cityName);
        searchCityEl.value = "";
    } else {
        alert("Please enter a City");
    }
}

// convert coty to latitude and longitude co-ordinates
var getLonLat = function(cityName) {
    var apiUrl = "https://geocode.xyz/" + cityName + "?json=1&auth=163611677966105275686x24104";
    // make a request to the geocode API
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

// get weather data from co-ordinates
var getWeather = function(lat, lon, cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=529ec8fe3b43964d9f7c544819c519d6";
        // make a request to the openweathermap API
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

// convert timestamp to date
var getDate = function(timestamp) {
    var theDate = new Date(timestamp * 1000).toLocaleDateString('en-US');
    return theDate;
}

// style the background of UV Index
var styleColorUVI = function(dataCurrentUVI) {
    if (dataCurrentUVI <= 2) {
        colorUVI = "uvi-gre";
    } else if  (dataCurrentUVI <= 5) {
        colorUVI = "uvi-yel";
    } else if  (dataCurrentUVI <= 7) {
        colorUVI = "uvi-ora";
    } else if  (dataCurrentUVI <= 10) {
        colorUVI = "uvi-red";
    } else {
        colorUVI = "uvi-vio";
    }
    return colorUVI;
}

// show weather data to user
var showWeather = function(data, cityName) {
    // show current weather
    searchResultsEl.textContent = "";
    var dateVal = getDate(data.current.dt);
    var currentWeatherEl = document.createElement("div");
    currentWeatherEl.classList = "border border-dark col-12";
    var cityEl = document.createElement("h2");
    cityEl.innerText = cityName + " (" + dateVal + ") ";
    var weatherIcon = document.createElement("img");
    weatherIcon.src = "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";
    weatherIcon.alt = data.current.weather[0].main + ": " + data.current.weather[0].description;
    cityEl.append(weatherIcon);
    var currentTemp = document.createElement("p");
    currentTemp.innerText = "Temp: " + data.current.temp + "F";
    var currentWind = document.createElement("p");
    currentWind.innerText = "Wind: " + data.current.wind_speed + "MPH";
    var currentHumid = document.createElement("p");
    currentHumid.innerText = "Humidity: " + data.current.humidity + " %";
    var currentUVI = document.createElement("p");
    var colorUVI = styleColorUVI(data.current.uvi);
    currentUVI.innerHTML = "UV Index: <span class='p-1 " + colorUVI + "'>" + data.current.uvi + "</span>";
    currentWeatherEl.appendChild(cityEl);
    currentWeatherEl.append(currentTemp,currentWind,currentHumid,currentUVI);

    // show 5-day forecast
    for (var i = 1; i< 6; i++) {
        var dateVal = getDate(data.daily[i].dt);
        console.log(dateVal, data.daily[i].temp.day, data.daily[i].wind_speed, data.daily[i].humidity);
    }

    searchResultsEl.appendChild(currentWeatherEl);
}

// listen for search submission
searchFormEl.addEventListener("submit", formSubmitHandler);
