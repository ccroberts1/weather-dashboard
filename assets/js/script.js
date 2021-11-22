//VARIABLE DECLARATIONS
var previousCities = [];

//FUNCTION DECLARATIONS
//Fetch function to retrieve JSON object from Geocoding API
function cityInput(userInput) {
  var requestCoords = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=1e8f3b63f2a5f1aa61e5202369bced42`;

  //Since One Call requires coordinates instead of city, this retrieves coordinates from a current weather API call
  fetch(requestCoords)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cityLat = data.coord.lat;
      var cityLon = data.coord.lon;
      var cityName = data.name;
      var requestCurrent = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=1e8f3b63f2a5f1aa61e5202369bced42`;

      //This fetch actually retrieves the One Call API call
      fetch(requestCurrent)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);

          createCurrent(data.current, cityName);
          cardCreation(data.daily);
        });
    });
}

function searchHandler(event) {
  event.preventDefault();
  var userCity = document.querySelector("#citySearch");
  var userInput = userCity.value;
  addCity(userInput);
  searchHistory();
  cityInput(userInput);
}

//Dynamically creates Current Day Forecast Card and populates with info from the Weather API
function createCurrent(obj, cityName) {
  //Select Current Card Div and empties it
  var currentDiv = document.querySelector("#currentDiv");
  currentDiv.innerHTML = "";
  //Dynamically creates structure of the card
  var currentCard = document.createElement("div");
  currentCard.setAttribute("class", "card currentCard my-3");
  currentDiv.appendChild(currentCard);
  var cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");
  currentCard.appendChild(cardBody);
  var currentTitle = document.createElement("h2");
  currentTitle.setAttribute("class", "card-title");
  cardBody.appendChild(currentTitle);
  var pTemp = document.createElement("p");
  pTemp.setAttribute("class", "card-text");
  cardBody.appendChild(pTemp);
  var pWind = document.createElement("p");
  pWind.setAttribute("class", "card-text");
  cardBody.appendChild(pWind);
  var pHumidity = document.createElement("p");
  pHumidity.setAttribute("class", "card-text");
  cardBody.appendChild(pHumidity);
  var pUV = document.createElement("p");
  pUV.setAttribute("class", "card-text");
  cardBody.appendChild(pUV);

  //Adds city name to card title
  currentTitle.append(cityName);

  //Retrieves date for current day card
  var currentDate = new Date(obj.dt * 1000);
  var currentDateTitle = ` (${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}/${currentDate.getFullYear()})`;
  currentTitle.append(currentDateTitle);

  //Adds weather icon to card title
  var icon = obj.weather[0].icon;
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${icon}.png`
  );
  currentTitle.append(weatherIcon);

  //Adds Temp, Wind, Humidity and UV Index fields
  pTemp.append(`Temp: ${obj.temp} °F`);
  pWind.append(`Wind: ${obj.wind_speed} MPH`);
  pHumidity.append(`Humidity: ${obj.humidity}%`);
  pUV.append(`UV Index:`);

  //This creates a span to house the number for the UV Index
  var uvNum = obj.uvi;
  var spanUVNum = document.createElement("span");
  pUV.append(spanUVNum);
  uvColors(spanUVNum, uvNum);
}

//Dynamically creates 5-Day Forecast Cards and populates them with info from the Weather API
function cardCreation(arr) {
  var fiveDayTitle = document.createElement("h3");
  var fiveDayDiv = document.querySelector("#fiveDayDiv");
  fiveDayTitle.textContent = "5-Day Forecast:";
  fiveDayDiv.innerHTML = "";
  fiveDayDiv.appendChild(fiveDayTitle);
  var fiveDayGroup = document.createElement("div");
  fiveDayGroup.setAttribute("class", "card-group");
  fiveDayDiv.appendChild(fiveDayGroup);

  for (var i = 1; i < 6; i++) {
    //Creates card and appends to card-group div
    var fiveDayCard = document.createElement("div");
    fiveDayCard.setAttribute("class", "card-group");
    fiveDayGroup.appendChild(fiveDayCard);
    //Creates card body and appends to card div
    var fiveDayBody = document.createElement("div");
    fiveDayBody.setAttribute("class", "card-body cardContent m-2");
    fiveDayCard.appendChild(fiveDayBody);
    //Creates title and appends to card-body div
    var fiveDayTitle = document.createElement("h4");
    var cardDate = new Date(arr[i].dt * 1000);
    fiveDayTitle.setAttribute("class", "card-title");
    fiveDayTitle.setAttribute("id", "cTitle");
    //Creates date and appends to card-title
    fiveDayTitle.append(
      ` ${
        cardDate.getMonth() + 1
      }/${cardDate.getDate()}/${cardDate.getFullYear()}`
    );
    fiveDayBody.appendChild(fiveDayTitle);
    //Creates weather icon and appends to card-title after date
    var icon = arr[i].weather[0].icon;
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${icon}.png`
    );
    fiveDayBody.append(weatherIcon);
    //Creates p element for Temp and appends to card-body
    var fiveDayTemp = document.createElement("p");
    fiveDayTemp.setAttribute("class", "card-text");
    fiveDayTemp.setAttribute("id", "cTemp");
    fiveDayTemp.append(`Temp: ${arr[i].temp.day} °F`);
    fiveDayBody.appendChild(fiveDayTemp);
    //Creates p element for Wind and appends to card-body
    var fiveDayWind = document.createElement("p");
    fiveDayWind.setAttribute("class", "card-text");
    fiveDayWind.setAttribute("id", "cWind");
    fiveDayWind.append(`Wind: ${arr[i].wind_speed} MPH`);
    fiveDayBody.appendChild(fiveDayWind);
    //Creates p element for Humidity and appends to card-body
    var fiveDayHty = document.createElement("p");
    fiveDayHty.setAttribute("class", "card-text");
    fiveDayHty.setAttribute("id", "cHumidity");
    fiveDayHty.append(`Humidity: ${arr[i].humidity}%`);
    fiveDayBody.appendChild(fiveDayHty);
    //Creates p element for UVI and appends to card-body
    var fiveDayUV = document.createElement("p");
    var spanUVNum = document.createElement("span");
    fiveDayUV.setAttribute("class", "card-text");
    fiveDayUV.setAttribute("id", "cuvIndex");
    fiveDayUV.append(`UV Index:`);
    fiveDayBody.appendChild(fiveDayUV);
    fiveDayUV.appendChild(spanUVNum);
    uvColors(spanUVNum, arr[i].uvi);
  }
}

//Styles the colors of the UV Index on the cards
function uvColors(span, num) {
  if (num < 3) {
    span.style.backgroundColor = "green";
    span.style.color = "white";
  } else if (num < 6) {
    span.style.backgroundColor = "yellow";
    span.style.color = "black";
  } else if (num < 8) {
    span.style.backgroundColor = "orange";
    span.style.color = "black";
  } else if (num < 11) {
    span.style.backgroundColor = "red";
    span.style.color = "white";
  } else {
    span.style.backgroundColor = "purple";
    span.style.color = "white";
  }
  span.append(num);
}

function searchHistory() {
  var searchHistory = document.querySelector("#searchHistory");
  searchHistory.innerHTML = "";
  previousCities = JSON.parse(localStorage.getItem("cities")) || [];
  for (i = 0; i < previousCities.length; i++) {
    var searchBtn = document.createElement("button");
    searchBtn.setAttribute("type", "button");
    searchBtn.setAttribute("class", "btn btnPrevious d-block");
    searchBtn.setAttribute("city", previousCities[i]);
    searchBtn.append(previousCities[i]);
    searchHistory.appendChild(searchBtn);
    searchBtn.addEventListener("click", function (event) {
      cityInput(event.target.getAttribute("city"));
    });
  }
}

function addCity(city) {
  previousCities.push(city);
  localStorage.setItem("cities", JSON.stringify(previousCities));
}

searchHistory();

//EVENT HANDLERS
//Click Event listener on the submit button which is connected to a function to create cards
document.querySelector("#submit").addEventListener("click", searchHandler);
