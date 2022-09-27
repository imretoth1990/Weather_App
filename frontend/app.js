// Get data from cities.js

import cities from './cities.js'

const cityNames = Object.keys(cities);

// *** Variables ***
const body = document.querySelector('body');
const rootElement = document.getElementById("root");
let isRendered = null;

// *** DOM ***

// Create Label, Input field and Submit Button

const renderDOM = () => {
  // Display header
  const displayHeader = document.createElement('div');
  displayHeader.setAttribute('id', 'displayHeader');
  rootElement.appendChild(displayHeader);
  
  // Display input
  const titleContainer = document.createElement('div');
  titleContainer.setAttribute('id', 'titleContainer');
  displayHeader.appendChild(titleContainer);
  
  // Display App title
  const appTitle = document.createElement('h2');
  appTitle.setAttribute('id', 'appTitle');
  titleContainer.appendChild(appTitle);

  const inputContainer = document.createElement('div');
  inputContainer.setAttribute('id', 'inputContainer');
  displayHeader.appendChild(inputContainer);

  // Previous button
  const leftButtonContainer = document.createElement('div');
  leftButtonContainer.setAttribute('id', 'leftButtonContainer');
  inputContainer.appendChild(leftButtonContainer);

  const previousButton = document.createElement('button');
  previousButton.setAttribute('id', 'previousButton');
  leftButtonContainer.appendChild(previousButton);

  const previousBtn = document.getElementById('previousButton');
  previousBtn.textContent = '<'; 

  // Label
  const searchBarContainer = document.createElement('div');
  searchBarContainer.setAttribute('id', 'searchBarContainer');
  inputContainer.appendChild(searchBarContainer);

  const labelElement = document.createElement("label");
  labelElement.setAttribute("for", "inputElement");
  // titleContainer.textContent = "Enter your location: ";
  searchBarContainer.appendChild(labelElement);
  // Input
  const inputElement = document.createElement("input");
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('list', 'datalist');
  inputElement.setAttribute("id", "inputElement");
  inputElement.setAttribute("name", "inputElement");
  inputElement.setAttribute('placeholder', 'Enter your location');
  inputElement.setAttribute('autocomplete', 'off'); 
  searchBarContainer.appendChild(inputElement);  

   // Next button

   const rightButtonContainer = document.createElement('div');
   rightButtonContainer.setAttribute('id', 'rightButtonContainer');
   inputContainer.appendChild(rightButtonContainer);

   const nextButton = document.createElement('button');
   nextButton.setAttribute('id', 'nextButton');
   rightButtonContainer.appendChild(nextButton);
 
   const nextBtn = document.getElementById('nextButton');
   nextBtn.textContent= '>';
 
  
  // Display button (newDiv)

  // Submit button
  const displayButton = document.createElement('div');
  displayButton.setAttribute('id', 'displayButton');
  displayHeader.appendChild(displayButton);

  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("id", "buttonElement");
  submitBtn.textContent = "OK";
  displayButton.appendChild(submitBtn);

  // - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _
  // Display app title

  const applicationTitle = document.getElementById('appTitle');
  applicationTitle.textContent = 'Weather App';

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

  displayWeather.innerHTML = `
  <h1>--</h1>
  <h2>C°: --</h2>
  <p>Feels like: --°</p>
  <p>Wind: 0 kp/h</p>
  `;

  // Display weather footer  
  const weatherFooter = document.createElement('div');
  weatherFooter.setAttribute('id', 'weatherFooter');
  displayWeatherContainer.appendChild(weatherFooter);

  weatherFooter.innerHTML = `
  <p>Short summary: --</p>
  <p>Last updated: yyyy/mm/dd</p>
  `;

  // Display page footer
  
  const pageFooter = document.createElement('footer');
  pageFooter.setAttribute('id', 'pageFooter');
  body.appendChild(pageFooter);

  const footer = document.getElementById('pageFooter');
  footer.textContent = '@allRigthsReserved_byGeri&Imi';
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
    deleteOptionList();
  }
};

const deleteOptionList = () => {
  const datalist = document.getElementById("datalist");
    datalist.remove();
    const options = document.getElementsByClassName("option");
    for (let i = 0; i < options.length; i++) {
      options[i].remove();
    }
    isRendered = null;
}

// Get data from weather API

const fetchWeatherData = async () => {
  const input = document.getElementById("inputElement");
  let cityInput = input.value;
  // Set url
  const url = "https://api.weatherapi.com/v1";
  const method = "/forecast.json";
  const key = "?key=489f1639341049318ba122521222609";
  const days = "&days=3";
  let city = `&q=${cityInput}`;

  try {
    // Get data
    const response = await fetch(url + method + key + city + days);
    const data = await response.json(); // -> current day
    
  
    let forecastedDays = data.forecast.forecastday.map((day) => {
      return  `<p>Day: ${new Date(day.date).toLocaleString('en-us', {weekday: 'short'})}</p>
      <p>Short summary: <em>${day.day.condition.text}</em></p>
      <img src="${day.day.condition.icon}"/>
      <h2>Avg C°: ${day.day.avgtemp_c}</h2>
      <p>Max wind: ${day.day.maxwind_kph} kph</p>`; 
    });
    
    console.log(forecastedDays);
  
  renderWeatherData(data);

  } catch (error) {
    console.error(error);
  }
};


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
  <h1> ${object.location.name} </h1>
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

// const changeBackgroundImage(

// )

// *** Functions calls ***
renderDOM();

// *** Event Listeners ***

// Get elements by ID
const input = document.getElementById("inputElement");
const submitBtn = document.getElementById("buttonElement");
const displayHeader = document.getElementById('displayHeader');

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
  deleteOptionList();
});


