let cities = document.getElementById('city').textContent; // Get the text content of the city element
let weatherCard = document.querySelector('.header'); // Select the element with the class 'header'

let api_key = '89a028d9525b1228af6dc51901eeff7b'; // Your OpenWeatherMap API key
let cityArray = cities.split(',').map(city => city.trim()); // Split and trim city names

// Iterate over each city and fetch weather data
for (let i = 0; i < cityArray.length; i++) {
    let city = cityArray[i];
    getCityCoordinates(city);
}

// Function to fetch weather details for a city
function getWeatherDetails(name, lat, lon, country) {
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            let date = new Date();
            weatherCard.innerHTML += `
            <div class="card">
            <h2>${name}</h2>
                <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="caard-footer">
                <p>${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}</p>
                <p>${name}, ${country}</p>
            </div>
            </div>
            `;
        })
        .catch(error => console.error('Error fetching weather details:', error));
}

// Function to fetch latitude and longitude of a city
function getCityCoordinates(cityName) {
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                let { lat, lon, name, country } = data[0];
                getWeatherDetails(name, lat, lon, country);
            } else {
                console.error('City not found:', cityName);
            }
        })
        .catch(error => console.error('Error fetching city coordinates:', error));
}
