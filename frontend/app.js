// Get data from cities.js
import cities from './cities.js';
const cityNames = Object.keys(cities);

// *** Variables ***
const BASE_URL = 'https://api.weatherapi.com/v1';
const key = '?key=489f1639341049318ba122521222609'; // dotenv fájlba az érzékeny adatokat kimenteni és aztán abból behívni őket
const body = document.querySelector('body');
const rootElement = document.getElementById('root');

let isRendered = null;
let isDay = null;
let lastCityInput = null; 
let lastCity = null;

// let isRendered, isDay, lastCityInput, lastCity;

let referenceDate = new Date();
referenceDate.setDate(referenceDate.getDate() + 15);

let requestedDate = new Date();
let urlDate = `&date=${requestedDate.toISOString().split('T')[0]}`;

let isPlaying = false;
let transparency = 0.5; 
let volume = 5;
let radioSet = false;

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
  previousButton.setAttribute('class', 'active');
  leftButtonContainer.appendChild(previousButton);

  const previousBtn = document.getElementById('previousButton');
  previousBtn.textContent = '<'; 

  // Label
  const searchBarContainer = document.createElement('div');
  searchBarContainer.setAttribute('id', 'searchBarContainer');
  inputContainer.appendChild(searchBarContainer);

  const labelElement = document.createElement('label');
  labelElement.setAttribute('for', 'inputElement');
  // titleContainer.textContent = 'Enter your location: ';
  searchBarContainer.appendChild(labelElement);

  // Input
  const inputElement = document.createElement('input');
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('id', 'inputElement');
  inputElement.setAttribute('list', 'favorite');
  inputElement.setAttribute('name', 'inputElement');
  inputElement.setAttribute('placeholder', 'Enter your location');
  inputElement.setAttribute('size', '10');
  inputElement.setAttribute('autocomplete', 'off');
  searchBarContainer.appendChild(inputElement);  

  // Create favorite datalist
  const favoriteDatalist = document.createElement('datalist');
  favoriteDatalist.setAttribute('id', 'favorite');
  searchBarContainer.appendChild(favoriteDatalist);

   // Next button

   const rightButtonContainer = document.createElement('div');
   rightButtonContainer.setAttribute('id', 'rightButtonContainer');
   inputContainer.appendChild(rightButtonContainer);

   const nextButton = document.createElement('button');
   nextButton.setAttribute('id', 'nextButton');
   nextButton.setAttribute('class', 'active');
   rightButtonContainer.appendChild(nextButton);
 
   const nextBtn = document.getElementById('nextButton');
   nextBtn.textContent= '>';
 
  
  // Display button (newDiv)

  // Submit button
  const displayButton = document.createElement('div');
  displayButton.setAttribute('id', 'displayButton');
  displayHeader.appendChild(displayButton);

  const submitBtn = document.createElement('button');
  submitBtn.setAttribute('id', 'submitBtn');
  submitBtn.setAttribute('class', 'active');
  submitBtn.textContent = 'OK';
  displayButton.appendChild(submitBtn);

  const addFavorite = document.createElement('button');
  addFavorite.setAttribute('id', 'addFavorite');
  addFavorite.setAttribute('class', 'active');
  addFavorite.textContent = '+';
  displayButton.appendChild(addFavorite); 

  // - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _ - _
  // Display app title

  const applicationTitle = document.getElementById('appTitle');
  applicationTitle.textContent = 'WeatherApp';

  // Display weather container
  const displayWeatherContainer = document.createElement('div');
  displayWeatherContainer.setAttribute('id', 'displayWeatherContainer');
  rootElement.appendChild(displayWeatherContainer);

 
  // Create audio button container 
  
  const audioButtonContainer = document.createElement('div');
  audioButtonContainer.setAttribute('id', 'audioButtons');
  displayWeatherContainer.appendChild(audioButtonContainer);


 // Create display field for radio channel name (Geri)

 const radioNameContainer = document.createElement('div');
 radioNameContainer.setAttribute('id', 'radioNameContainer');
 displayWeatherContainer.appendChild(radioNameContainer);

 document.getElementById('radioNameContainer').innerHTML = "No radio station";

  // Play button (child from displayWeatherContainer)

  const playButtonElement = document.createElement('button');
  playButtonElement.setAttribute('id', 'playBtn');
  playButtonElement.setAttribute('class', 'active');
  playButtonElement.textContent = '▶️';
  audioButtonContainer.appendChild(playButtonElement);

  const volumeMinusElement = document.createElement('button');
  volumeMinusElement.setAttribute('id', 'volumeMinus');
  volumeMinusElement.setAttribute('class', 'active');
  volumeMinusElement.textContent = '－';
  audioButtonContainer.appendChild(volumeMinusElement);

  const volumePlusElement = document.createElement('button');
  volumePlusElement.setAttribute('id', 'volumePlus');
  volumePlusElement.setAttribute('class', 'active');
  volumePlusElement.textContent = '＋';
  audioButtonContainer.appendChild(volumePlusElement);

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

  const spinner = document.createElement('div');
  spinner.setAttribute('hidden', '');
  spinner.setAttribute('id', 'spinner');
  displayWeatherContainer.appendChild(spinner);

  // Display weather footer  
  const weatherFooter = document.createElement('div');
  weatherFooter.setAttribute('id', 'weatherFooter');
  displayWeatherContainer.appendChild(weatherFooter);

  weatherFooter.innerHTML = `
  <p>Short summary: --</p>
  <p>Last updated: yyyy/mm/dd</p>
  `;

//   // Display page footer
  
  const pageFooter = document.createElement('footer');
  pageFooter.setAttribute('id', 'pageFooter');
  body.appendChild(pageFooter);

  const footer = document.getElementById('pageFooter');
  footer.textContent = '@allRigthsReserved_byGeri&Imi';
};

// *** Functions ***


const radioControlCenter = radio => {
// RADIO SECTION

// Radio Variables

const volumePlus = document.getElementById('volumePlus');
const volumeMinus = document.getElementById('volumeMinus');
const container = document.getElementById('audioButtons');
const playBtn = document.getElementById('playBtn');
// Radio functions

const volumeUp = () => {
if (volume > 0) {
    volumeMinus.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
    volumeMinus.setAttribute('class', 'active');
}

if (volume < 10) {
    radio.volume += 0.1;
    transparency += 0.1;
    volume += 1;
    container.style.backgroundColor = `rgb(255, 255, 255,${transparency})`;
} else if (volume === 10) {
    volumePlus.style.backgroundColor = 'rgba(172, 255, 47, 1)';
    volumePlus.removeAttribute('class', 'active');
}
};


const volumeDown = () => {
if (volume < 10) {
  volumePlus.setAttribute('class', 'active');
  volumePlus.style.backgroundColor = 'rgba(172, 255, 47, 0.5)';
} 

if (radio.volume > 0 && radio.volume !== 1.3877787807814457e-16) {
  radio.volume -= 0.1;
  transparency -= 0.1;
  volume -= 1;
  container.style.backgroundColor = `rgb(255, 255, 255,${transparency})`;
} 

if (volume === 0){
  volumeMinus.removeAttribute('class', 'active');
  volumeMinus.style.backgroundColor = 'rgba(255, 0, 0)';
}
};


const playStop = () => {    
  if (!radioSet) {
    radio.volume = 0.5;
    radioSet = true;
  }

  if (!isPlaying) {
    isPlaying = true;
    volumeMinus.addEventListener('click', volumeDown);
    volumePlus.addEventListener('click', volumeUp);
    playBtn.textContent = '⏸';
    playBtn.style.backgroundColor = 'rgb(255, 208, 0)';
    radio.play();
  } else if (isPlaying) {
    radio.pause();
    isPlaying = false;
    volumeMinus.removeEventListener('click', volumeDown);
    volumePlus.removeEventListener('click', volumeUp);
    playBtn.textContent = '▶️';
    playBtn.style.backgroundColor = 'aquamarine';
  }
};

// Event listeners

// const stopBtn = document.getElementById('stopBtn');

playBtn.addEventListener('click', playStop);
};


// Define autocomplete function

const renderAutocomplete = (listOfCities) => {
  // DOM

  // Create autocomplete datalist
  const datalistElement = document.createElement('datalist');
  datalistElement.setAttribute('id', 'datalist');
  datalistElement.setAttribute('autocomplete', 'off');
  rootElement.appendChild(datalistElement);

  // Create options with value from listOfCities
  if (listOfCities.length === 0) {
    alert('Please enter a valid value!');    
  } else {
    listOfCities.forEach((item) => {
      const datalist = document.getElementById('datalist');
      const optionElement = document.createElement('option');
      optionElement.setAttribute('class', 'option');
      optionElement.setAttribute('value', item);
      // optionElement.textContent = item;
      datalist.appendChild(optionElement);
    });
  }
};

// Call autocomplete after 2nd letter

const limitSearch = () => {
  const input = document.getElementById('inputElement');
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
    const options = document.getElementsByClassName('option');
    for (let i = 0; i < options.length; i++) {
      options[i].remove();
    }
    isRendered = null;
};

// Get data from weather API

const fetchWeatherData = async () => {
  const input = document.getElementById('inputElement');
  const method = '/current.json';
  
  // save input so that if we change date and press OK, then the current day will be shown
  let cityInput = input.value;
  if (cityInput !== lastCityInput && cityInput !== '') lastCityInput = input.value;  
  let city = `&q=${lastCityInput}`;

  // guard clause
  if (!lastCityInput) return;

  try {
    // Get data
    const response = await fetch(BASE_URL + method + key + city + urlDate);
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
    const response = await fetch(BASE_URL + method + key + `&q=${lastCityInput}` + urlDate);
    const data = await response.json(); 
    renderNextOrPrevious(data);
  } catch (error) {
    console.error(error);
  }
};

const renderNextOrPrevious = object => {
  document.getElementById('displayWeather').classList.remove('nightBackground');
  let forecastDay = object.forecast.forecastday[0];

  // guard clause
  if (forecastDay.date === object.location.localtime.split(' ')[0]) return renderWeatherData(object);
  
  let displayWeather = document.getElementById('displayWeather');
  let displayHeader = document.getElementById('weatherHeader');
  let displayFooter = document.getElementById('weatherFooter');
  
  displayWeather.classList.remove('nightBackground');  

  displayWeather.innerHTML = `
  <img id='condition-icon' src='${forecastDay.day.condition.icon}'/>
  <h1> ${object.location.name} </h1>
  <h2>Avg C°: ${forecastDay.day.avgtemp_c}</h2>
  <p>Feels like: -- </p>
  <p>Max wind: ${forecastDay.day.maxwind_kph} kph</p>
  `;

  const condition = requestedDate.toISOString().split('T')[0] < new Date().toISOString().split('T')[0];
  const message = condition ? 'Past weather' : 'Forecast';

  displayHeader.innerHTML = `
  <p>Country: ${object.location.country} </p>
  <p>${message}: <b>${new Date(forecastDay.date).toLocaleString('en-us', {weekday: 'long'})}</b>, ${forecastDay.date}</p>
  `;
  
  displayFooter.innerHTML = `
  <p>Short summary: <em>${forecastDay.day.condition.text}</em></p>
  <p>Last updated: yyyy/mm/dd</p>
  `;
};

const getCityID = city => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'be335f03a5mshac0ad05272f77bfp159179jsn81033b82a8e1',
		  'X-RapidAPI-Host': '50k-radio-stations.p.rapidapi.com'
	}
};  

  fetch(`https://50k-radio-stations.p.rapidapi.com/get/cities?keyword=${city}`, options)
	  .then(response => response.json())
	  .then(response => {
        const cityID = response.data[0].id;
        getRadioStation(cityID);
    })
	  .catch(err => console.error(err));
  };


// Display weather for requested location

const renderWeatherData = (object) => {
  // const displayWeather = document.getElementById('displayWeather');

  // if (!isDay) displayWeather.classList.add('nightBackground');
  // else displayWeather.classList.remove('nightBackground');

  changeWeatherDisplayImage(object.current.condition.text);

  const displayWeatherText = document.getElementById('displayWeather');
  const displayHeaderText = document.getElementById('weatherHeader');
  const displayFooterText = document.getElementById('weatherFooter');
  
  displayWeatherText.innerHTML = `
  <img id='condition-icon'src='${object.current.condition.icon}'/>
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
  
  if (lastCity !== cityName) {
    getImagefromPexelsAPI(cityName);  
    lastCity = cityName;
  }
  
  getCityID(cityName);  
};


const changeBackgroundImage = url => {
  if (url) body.style.backgroundImage = `url('${url}')`;
  else body.style.backgroundImage = 'linear-gradient(rgb(90, 125, 143),rgb(110, 155, 159), rgb(131, 193, 195), rgb(210, 223, 221))';
};

const getImagefromPexelsAPI = city => {
  
  fetch(`https://api.pexels.com/v1/search?query=${city}`,{
    headers: {
    Authorization: '563492ad6f91700001000001b67eb2f1acb841f8ae74ace0d77f4927' // api key into dotenv file
    }
  })
  .then((resp) => resp.json())
  .then((data) => {
    const object = data.photos;
    const randomIndex = Math.floor(Math.random() * object.length);
    const randomUrl = object[randomIndex]?.src.original;
    const spinner = document.getElementById('spinner');

    if (object.length !== 0) {
      spinner.removeAttribute('hidden');
      setTimeout(() => {
        changeBackgroundImage(randomUrl);
        spinner.setAttribute('hidden', '');
      }, 1500); 
    } else changeBackgroundImage(randomUrl);
  })
  .catch((err) => console.error(err));
};

const getRadioStation = cityID => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'be335f03a5mshac0ad05272f77bfp159179jsn81033b82a8e1',
		  'X-RapidAPI-Host': '50k-radio-stations.p.rapidapi.com'
	}
};

// get next page: &page=1
  fetch(`https://50k-radio-stations.p.rapidapi.com/get/channels?city_id=${cityID}`, options)
    .then(response => response.json())
    .then(response => {
      const randomIndex = Math.floor(Math.random() * response.data.length);
      const URL = response.data[randomIndex].streams_url.find(({ codec }) => codec === 'mp3')?.url;

      if (!URL) {
        document.getElementById('radioNameContainer').textContent = "Radio station is not available";
      } else if (URL) {
        document.getElementById('radioNameContainer').textContent = response.data[randomIndex].name;
      }

      const radio = new Audio(URL);
      radioControlCenter(radio);
    })
    .catch(err => console.error(err));
};

const changeWeatherDisplayImage = inputValue => {

  let currentWeatherText = inputValue.toLowerCase();

  let displayWeather = document.getElementById('displayWeather');

  // if (isDay) {
  //   // Day pictures
  //   switch(currentWeatherText.includes()) {
  //     case 'rain':
  //       displayWeather.style.backgroundImage = "url('/frontend/displayWeather_images/rain_isDay.jpeg')";
  //       break;
  //     default:
  //       displayWeather.style.backgroundImage = "url('/frontend/displayWeather_images/sunny_isDay.jpeg')";
  //   }


  // } else if (!isDay) {
  //   // Night pictures
  //   switch(currentWeatherText.includes()) {
  //     case 'rain':
  //       displayWeather.style.backgroundImage = "url('/frontend/displayWeather_images/night_rainy.jpeg')";
  //       break;
  //     default:
  //       displayWeather.style.backgroundImage = "url('/frontend/displayWeather_images/clear_night.jpeg')";
  //   }
  // }

    // Day pictures
    switch(currentWeatherText.includes()) {
      case 'cloud':
        displayWeather.style.backgroundImage = isDay 
        ? "url('/frontend/displayWeather_images/rain_isDay.jpeg')" 
        : "url('/frontend/displayWeather_images/night_rainy.jpeg')";
        break;
      default:
        displayWeather.style.backgroundImage = isDay
        ? "url('/frontend/displayWeather_images/sunny_isDay.jpeg')" 
        : "url('/frontend/displayWeather_images/clear_night.jpeg')";
    }
};
  
// *** Functions calls ***
renderDOM();

// *** Event Listeners ***

// Get elements by ID
const input = document.getElementById('inputElement');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextButton');
const previousBtn = document.getElementById('previousButton');
const displayHeader = document.getElementById('displayHeader');

// Define event listener functions
const fadeOut = () => {
  const input = document.getElementById('inputElement');
  input.setAttribute('placeholder', '');
};

const fadeIn = () => {
  const input = document.getElementById('inputElement');
  input.value = '';
  input.setAttribute('placeholder', 'Enter your location');
};

const saveFavorite = () => {
  const favDatList = document.getElementById('favorite');
  const option = document.createElement('option');
  option.textContent = input.value;

  if (cityNames.includes(input.value)) {
    favDatList.appendChild(option);
    alert(`Saved to favorites succesfully!`);
  } else {
    alert('Enter a valid value');
  }
};

const previousNextButton = event => {
  const ISO_currentDate = new Date().toISOString().split('T')[0];
  let ISO_requestedDate = requestedDate.toISOString().split('T')[0];

  if ((event.target === submitBtn || event.key === "Enter") && lastCityInput) {
    urlDate = `&date=${ISO_currentDate}`;
    requestedDate = new Date();
  } else if ((event.target === previousBtn || event.key === 'ArrowLeft') && lastCityInput && !event.repeat) {
    requestedDate.setDate(requestedDate.getDate() - 1);
    urlDate = `&date=${ISO_requestedDate}`;
    if (ISO_requestedDate < ISO_currentDate) {
      fetchNextOrPrevious('history');
    } else fetchNextOrPrevious('forecast');
  } else if ((event.target === nextBtn || event.key === 'ArrowRight') && lastCityInput && !event.repeat && referenceDate > requestedDate) {
    requestedDate.setDate(requestedDate.getDate() + 1);
    urlDate = `&date=${ISO_requestedDate}`;
    if (ISO_requestedDate < ISO_currentDate) {
      fetchNextOrPrevious('history');
    } else fetchNextOrPrevious('forecast');
  }
};

// Call event listener functions
input.addEventListener('input', () => {
  limitSearch();
});

input.addEventListener('click', () => {
  fadeOut();
  const listValue = inputElement.getAttribute('list');
  if(listValue === '') {
    inputElement.setAttribute('list', 'favorite');
  }
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && input.value === '') {
    enterStop.play();
  }
  if (event.key === 'Enter') {
    input.value = input.value.split(' ').map(city => city[0].toUpperCase() + city.slice(1)).join(' ');
    if (cityNames.includes(input.value)) {
      fetchWeatherData();
      fadeIn();
      deleteOptionList();
    } else {
      enterStop.play();
    }
  }
});

submitBtn.addEventListener('click', () => {
  fetchWeatherData();
  fadeIn();
  deleteOptionList();
});

addFavorite.addEventListener('click', saveFavorite);

document.addEventListener('click', previousNextButton);
document.addEventListener('keydown', previousNextButton);

