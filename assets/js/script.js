//VARIABLE DECLARATIONS
var pTemp = document.querySelector("#temp");
var pWind = document.querySelector("#wind");
var pHumidity = document.querySelector("#humidity");
var pUV = document.querySelector("#uvIndex");
var currentCard = document.querySelector("#currentTitle");

//FUNCTION DECLARATIONS
//Fetch function to retrieve JSON object from Geocoding API
function cityInput(event) {
  event.preventDefault();
  var userCity = document.querySelector("#citySearch");
  var userInput = userCity.value;
  var requestCoords = `http://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=1e8f3b63f2a5f1aa61e5202369bced42`;

  //Since One Call requires coordinates instead of city, this retrieves coordinates from a current weather API call
  fetch(requestCoords)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cityLat = data.coord.lat;
      var cityLon = data.coord.lon;
      var cityName = data.name;
      var requestCurrent = `http://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=1e8f3b63f2a5f1aa61e5202369bced42`;

      //This fetch actually retrieves the One Call API call
      fetch(requestCurrent)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          currentCard.append(cityName);
          pTemp.append(`Temp: ${data.current.temp} °F`);
          pWind.append(`Wind: ${data.current.wind_speed} MPH`);
          pHumidity.append(`Humidity: ${data.current.humidity}%`);
          pUV.append(`UV Index: ${data.current.uvi}`);
        });
    });
}
//Card create function - dynamically creates cards and iterates over an array to retrieve specific information
//For icon, use data.weather.icon

//EVENT HANDLERS
//Click Event listener on the submit button which is connected to a function to create cards
document.querySelector("#submit").addEventListener("click", cityInput);
