// Get data from cities.js

import cities from './cities.js'

const cityNames = Object.keys(cities);

// *** Variables ***
const rootElement = document.getElementById("root");
let isRendered = null;

// *** DOM ***

// Create Label, Input field and Submit Button

const renderDOM = () => {
  // Display input background
  const displayInputBackground = document.createElement('div');
  displayInputBackground.setAttribute('id', 'displayInputBackground');
  rootElement.appendChild(displayInputBackground);
  
  // Display input
  const displayInput = document.createElement('div');
  displayInput.setAttribute('id', 'displayInput');
  displayInputBackground.appendChild(displayInput);
  
  // Label
  const labelElement = document.createElement("label");
  labelElement.setAttribute("for", "inputElement");
  // displayInput.textContent = "Enter your location: ";
  displayInput.appendChild(labelElement);
  
  // Input
  const inputElement = document.createElement("input");
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('list', 'datalist');
  inputElement.setAttribute("id", "inputElement");
  inputElement.setAttribute("name", "inputElement");
  inputElement.setAttribute('placeholder', 'Enter your location');
  inputElement.setAttribute('autocomplete', 'off'); 
  displayInput.appendChild(inputElement);  
  
  // Display button (newDiv)

  // Submit button
  const displayButton = document.createElement('div');
  displayButton.setAttribute('id', 'displayButton');
  displayInput.appendChild(displayButton);

  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("id", "buttonElement");
  submitBtn.textContent = "OK";
  displayButton.appendChild(submitBtn);

  // - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _
  
  // Display weather container
  const displayWeatherContainer = document.createElement('div');
  displayWeatherContainer.setAttribute('id', 'displayWeatherContainer');
  rootElement.appendChild(displayWeatherContainer);

  // Display weather header
  const weatherHeader = document.createElement('div');
  weatherHeader.setAttribute('id', 'weatherHeader');
  displayWeatherContainer.appendChild(weatherHeader);
  weatherHeader.innerHTML = `
  <p>Country: untracked location </p>
  <p>Local time: 00:00</p>
  `;

  // Display weather 
  const displayWeather = document.createElement('div');
  displayWeather.setAttribute('id', 'displayWeather');
  displayWeatherContainer.appendChild(displayWeather);

  // Display weather footer  
  const weatherFooter = document.createElement('div');
  weatherFooter.setAttribute('id', 'weatherFooter');
  displayWeatherContainer.appendChild(weatherFooter);
  weatherFooter.innerHTML = `
  <p>Short summary: --</p>
  <p>Last updated: yyyy/mm/dd</p>
  `;

  displayWeather.innerHTML = `
  <h2>C°: --</h2>
  <p>Feels like: --°</p>
  <p>Wind: 0 kp/h</p>
  `;
};

// *** Functions ***

// Define autocomplete function

const renderAutocomplete = (listOfCities) => {
  // DOM

  // Create datalist
  const datalistElement = document.createElement("datalist");
  datalistElement.setAttribute("id", "datalist");
  root.appendChild(datalistElement);

  // Create options with value from listOfCities
  if (listOfCities.length === 0) {
    alert('Please enter a valid value!');    
  } else {
    listOfCities.forEach((item) => {
      const datalist = document.getElementById("datalist");
      const optionElement = document.createElement("option");
      optionElement.setAttribute("class", "option");
      optionElement.setAttribute("value", item);
      // optionElement.textContent = item;
      datalist.appendChild(optionElement);
    });
  }
};

// Call autocomplete after 2nd letter

const limitSearch = () => {
  const input = document.getElementById("inputElement");
  const userInput = input.value;
  const inputLength = userInput.length;
  if (inputLength > 2 && !isRendered) {
    const filteredCities = cityNames.filter((item) => item.toLowerCase().includes(userInput.toLowerCase()));
    renderAutocomplete(filteredCities);
    isRendered = true;
  } else if (inputLength < 2 && isRendered) {
    const datalist = document.getElementById("datalist");
    datalist.remove();
    const options = document.getElementsByClassName("option");
    for (let i = 0; i < options.length; i++) {
      options[i].remove();
    }
    isRendered = null;
  }
};

// Get data from weather API

const fetchWeatherData = async () => {
  const input = document.getElementById("inputElement");
  let cityInput = input.value;
  // Set url
  const url = "https://api.weatherapi.com/v1";
  const method = "/forecast.json";
  const key = "?key=489f1639341049318ba122521222609";
  let city = `&q=${cityInput}`;

  try {
    // Get data
    const response = await fetch(url + method + key + city);
    const data = await response.json();
    // return data;
    console.log(data);
    renderWeatherData(data);
  } catch (error) {
    console.error(error);
  }
};

// forecast.forecastday[0].day

/*  const forecastDiv = document.createElement("div")

 const generateForecastTable = () => {
  // create a <table> element and a <tbody> element
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody")

  // create all cells
  for (let i = 0; i<2; i++) {

    //creates a table row
    const row = document.createElement("tr");

    for (let j = 0; j < 2; j++) {
      // create a <td> element and a text node, make the text ...
      // ... node the contents of the <td>, and put the <td> at ...
      // ... the end of the table row
      const cell = document.createElement("td");
      const cellText = document.createTextNode(`cell in rrow ${i}, column${j}`);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblbody.appendChild(row)
  }
  
  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // append <table> into <body>
  document.body.appendChild(tbl);
  // set the border attribute of tbl to '2'
  tbl.setAttribute("border", "2");
 }



forecast.forecastday[0].day.daily_chance_of_rain


 display.innerHTML = `
  <p>Short summary: <em>${forecast.forecastday[0].day.condition.text}</em></p>
  <img src="${forecast.forecastday[0].day.condition.icon}"/>
  <h2>Avg C°: ${forecast.forecastday[0].day.avgtemp_c}</h2>
  <p>Max wind: ${forecast.forecastday[0].day.maxwind_kph} kph</p>
  `;

 */


// Display weather for requested location

const renderWeatherData = (object) => {
  const displayWeather = document.getElementById("displayWeather");

  if (object.current.is_day === 1 && displayWeather.classList.contains("nightBackground")) {
    displayWeather.classList.toggle("nightBackground");
  }

  const displayWeatherText = document.getElementById('displayWeather');
  const displayHeaderText = document.getElementById('weatherHeader');
  const displayFooterText = document.getElementById('weatherFooter');
  
  displayWeatherText.innerHTML = `
  <img id='condition-icon'src="${object.current.condition.icon}"/>
  <h2>C°: ${object.current.temp_c}</h2>
  <p>Feels like: ${object.current.feelslike_c} C°</p>
  <p>Wind: ${object.current.wind_kph} kph</p>
  `;
  
  displayHeaderText.innerHTML = `
  <p>Country: ${object.location.country} </p>
  <p>Local time: ${object.location.localtime} </p>
  `;
  
  displayFooterText.innerHTML = `
  <p>Short summary: <em>${object.current.condition.text}</em></p>
  <p>Last updated: ${object.current.last_updated}</p>
  `;

  if (object.current.is_day === 0) displayWeather.classList.toggle("nightBackground"); 
}

const fadeOut = () => {
  const input = document.getElementById("inputElement");
  input.setAttribute('placeholder', '');
};

const fadeIn = () => {
  const input = document.getElementById("inputElement");
  input.value = '';
  input.setAttribute('placeholder', 'Enter your location');
};

// *** Functions calls ***
renderDOM();

// *** Event Listeners ***

// Get elements by ID
const input = document.getElementById("inputElement");
const submitBtn = document.getElementById("buttonElement");
const displayInputBackground = document.getElementById('displayInputBackground');

// Add event listener functions
input.addEventListener('input', limitSearch);
input.addEventListener('click', fadeOut);
input.addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    input.value = input.value[0].toUpperCase() + input.value.slice(1);
  }
});

submitBtn.addEventListener("click", () => {
  fetchWeatherData();
  fadeIn();
});


