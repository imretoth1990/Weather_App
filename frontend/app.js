// Get data from cities.js
import cities from './cities.js'
const cityNames = Object.keys(cities);

// *** Variables ***
const url = "https://api.weatherapi.com/v1";
const key = "?key=489f1639341049318ba122521222609";
const body = document.querySelector('body');
const rootElement = document.getElementById("root");

let isRendered = null;
let isDay = null;
let lastCityInput = null;
let date = new Date()
let urlDate = `&date=${date.toISOString().split('T')[0]}`;

// Sound effects

let enterStop = new Audio('enterStop.mp3');

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
  inputElement.setAttribute("id", "inputElement");
  inputElement.setAttribute('list', 'favorite');
  inputElement.setAttribute("name", "inputElement");
  inputElement.setAttribute('placeholder', 'Enter your location');
  searchBarContainer.appendChild(inputElement);  

    // Create favorite datalist
    const favoriteDatalist = document.createElement("datalist");
    favoriteDatalist.setAttribute('id', 'favorite');
    searchBarContainer.appendChild(favoriteDatalist);

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
  submitBtn.setAttribute("id", "submitBtn");
  submitBtn.textContent = "OK";
  displayButton.appendChild(submitBtn);

  const addFavorite = document.createElement('button');
  addFavorite.setAttribute('id', 'addFavorite');
  addFavorite.textContent = "+";
  displayButton.appendChild(addFavorite); 

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
  <p>Wind: 0 kph</p>
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

  // Create autocomplete datalist
  const datalistElement = document.createElement("datalist");
  datalistElement.setAttribute("id", "datalist");
  datalistElement.setAttribute("autocomplete", "off");
  rootElement.appendChild(datalistElement);

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
  if (inputLength !== 0) {
    input.removeAttribute('list', 'favorite');
    input.setAttribute('list', 'datalist');
  }
  if (inputLength > 2 && !isRendered) {
    const filteredCities = cityNames.filter((item) => item.toLowerCase().includes(userInput.toLowerCase()));
    renderAutocomplete(filteredCities);
    isRendered = true;
  } else if (inputLength < 2 && isRendered) {
    deleteOptionList();
  }
};

const deleteOptionList = () => {
    inputElement.removeAttribute('list');
    inputElement.setAttribute('list', 'favorite');
    // Delete autocomplete datalist
    const datalist = document.getElementById('datalist');
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
  const method = "/current.json";
  
  // save input so that if we change date and press OK, then the current day will be shown
  let cityInput = input.value;
  if (cityInput !== lastCityInput && cityInput !== '') lastCityInput = input.value;  
  let city = `&q=${lastCityInput}`;

  if (!lastCityInput) return;

  try {
    // Get data
    const response = await fetch(url + method + key + city + urlDate);
    const data = await response.json();    
    isDay = data.current.is_day;  
    renderWeatherData(data);
    
  } catch (error) {
    console.error(error);
  }
};

const fetchNextOrPrevious = async (searchRequirement) => {
  const method = `/${searchRequirement}.json`;
  try {
    const response = await fetch(url + method + key + `&q=${lastCityInput}` + urlDate);
    const data = await response.json(); 
    renderNextOrPrevious(data);
  } catch (error) {
    console.error(error);
  }
};

const renderNextOrPrevious = (object) => {
  document.getElementById("displayWeather").classList.remove("nightBackground")
  let forecastDay = object.forecast.forecastday[0]

  if (forecastDay.date === object.location.localtime.split(" ")[0]) return renderWeatherData(object);
  
  const displayWeather = document.getElementById("displayWeather");
  const displayWeatherText = document.getElementById('displayWeather');
  const displayHeaderText = document.getElementById('weatherHeader');
  const displayFooterText = document.getElementById('weatherFooter');
  
  displayWeather.classList.remove("nightBackground");  

  displayWeatherText.innerHTML = `
  <img id='condition-icon' src="${forecastDay.day.condition.icon}"/>
  <h1> ${object.location.name} </h1>
  <h2>Avg C°: ${forecastDay.day.avgtemp_c}</h2>
  <p>Feels like: -- </p>
  <p>Max wind: ${forecastDay.day.maxwind_kph} kph</p>
  `;
  
  let message = null;

  date.toISOString().split('T')[0] < new Date().toISOString().split('T')[0] ? message = "Past weather" : message = "Forecast";

  displayHeaderText.innerHTML = `
  <p>Country: ${object.location.country} </p>
  <p>${message}: <b>${new Date(forecastDay.date).toLocaleString('en-us', {weekday: 'long'})}</b>, ${forecastDay.date}</p>
  `;
  
  displayFooterText.innerHTML = `
  <p>Short summary: <em>${forecastDay.day.condition.text}</em></p>
  <p>Last updated: yyyy/mm/dd</p>
  `;
};


// Display weather for requested location

const renderWeatherData = (object) => {
  const displayWeather = document.getElementById("displayWeather");

  if (!isDay) displayWeather.classList.add("nightBackground");
  else displayWeather.classList.remove("nightBackground");

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
  
  const cityName = object.location.name;
  getImagefromPexelsAPI(cityName);
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

const saveFavorite = () => {
  const favDatList = document.getElementById('favorite');
  const option = document.createElement('option');
  option.setAttribute('value', input.value);

  if (cityNames.includes(input.value)) {
    favDatList.appendChild(option);
    alert(`Saved to favorites succesfully!`);
  } else {
    alert('Enter a valid value');
  }
};

const changeBackgroundImage = (url) => {
  // body.style.removeAttribute('backgroundImage');
  body.style.backgroundImage = `url('${url}')`;
}

const getImagefromPexelsAPI = (city) => {
  // city => object.location.name
  fetch(`https://api.pexels.com/v1/search?query=${city}`,{
    headers: {
    Authorization: "563492ad6f91700001000001b67eb2f1acb841f8ae74ace0d77f4927"
    }
  })
    .then((resp) => resp.json())
    .then((data) => {
      let object = data.photos;
      console.log("object", object);
      // let randomIndex = Math.floor(Math.random() * object.length - 1);
      let randomUrl = object[1].src.original;
      // console.log(randomUrl);
      // console.log(object)
      changeBackgroundImage(randomUrl);
    })
    .catch((err) => console.error(err));
};


  
// *** Functions calls ***
renderDOM();

// *** Event Listeners ***

// Get elements by ID
const input = document.getElementById("inputElement");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById('nextButton');
const previousBtn = document.getElementById('previousButton');
const displayHeader = document.getElementById('displayHeader');

// Add event listener functions
input.addEventListener('input', () => {
  limitSearch();
});

input.addEventListener('click', (ev) => {
  fadeOut();
  const listValue = inputElement.getAttribute('list');
  if(listValue === "") {
    inputElement.setAttribute('list', 'favorite');
  }
});
input.addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    input.value = input.value[0].toUpperCase() + input.value.slice(1);
    if (cityNames.includes(input.value)) {
      fetchWeatherData();
      fadeIn();
      deleteOptionList();
    } else {
      enterStop.play();
    }
  }
});

submitBtn.addEventListener("click", () => {
  fetchWeatherData();
  fadeIn();
  deleteOptionList();  
});


addFavorite.addEventListener('click', saveFavorite);

document.body.addEventListener("click", (event) => {
  if (event.target === submitBtn && lastCityInput) {
    urlDate = `&date=${new Date().toISOString().split('T')[0]}`;
    date = new Date();
  }

  if (event.target === previousBtn && lastCityInput) {
    date.setDate(date.getDate() - 1);
    urlDate = `&date=${date.toISOString().split('T')[0]}`;
    if(date.toISOString().split('T')[0] < new Date().toISOString().split('T')[0]) {
      fetchNextOrPrevious("history");
    } else fetchNextOrPrevious("forecast");
  } 

  if (event.target === nextBtn && lastCityInput) {
    date.setDate(date.getDate() + 1);
    urlDate = `&date=${date.toISOString().split('T')[0]}`;
    if(date.toISOString().split('T')[0] < new Date().toISOString().split('T')[0]) {
      fetchNextOrPrevious("history");
    } else fetchNextOrPrevious("forecast");
  }
});