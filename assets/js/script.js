//VARIABLE DECLARATIONS
var pTemp = document.querySelector("#temp");
var pWind = document.querySelector("#wind");
var pHumidity = document.querySelector("#humidity");
var currentCard = document.querySelector("#currentTitle");
var pUV = document.querySelector("#uvIndex");

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

          //Adds city name to card title
          currentCard.append(cityName);

          //Retrieves date for current day card
          var date = new Date(data.current.dt * 1000);
          var currentDate = ` (${
            date.getMonth() + 1
          }/${date.getDate()}/${date.getFullYear()})`;
          currentCard.append(currentDate);

          //Adds weather icon to card title
          var icon = data.current.weather[0].icon;
          var weatherIcon = document.createElement("img");
          weatherIcon.setAttribute(
            "src",
            `http://openweathermap.org/img/wn/${icon}.png`
          );
          currentCard.append(weatherIcon);

          //Adds Temp, Wind, Humidity and UV Index fields
          pTemp.append(`Temp: ${data.current.temp} °F`);
          pWind.append(`Wind: ${data.current.wind_speed} MPH`);
          pHumidity.append(`Humidity: ${data.current.humidity}%`);
          pUV.append(`UV Index:`);

          //This creates a span to house the number for the UV Index
          var spanUVNum = document.createElement("span");
          pUV.append(spanUVNum);
          var uvNum = data.current.uvi;

          //This determines the background-color for the UV Index
          if (uvNum <= 2) {
            spanUVNum.style.backgroundColor = "green";
          } else if (uvNum > 2 && uvNum <= 5) {
            spanUVNum.style.backgroundColor = "yellow";
          } else if (uvNum > 5 && uvNum < 8) {
            spanUVNum.style.backgroundColor = "orange";
          } else if (uvNum > 7 && uvNum < 11) {
            spanUVNum.style.backgroundColor = "red";
          } else {
            spanUVNum.style.backgroundColor = "purple";
          }
          spanUVNum.style.color = "white";
          spanUVNum.append(uvNum);
        });
    });
}
//Card create function - dynamically creates cards and iterates over an array to retrieve specific information
//For icon, use data.weather.icon

//EVENT HANDLERS
//Click Event listener on the submit button which is connected to a function to create cards
document.querySelector("#submit").addEventListener("click", cityInput);
