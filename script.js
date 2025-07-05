const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const apiKey = "004807198aec074090b40e1d34b100bf";
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");
const countryTxt = document.querySelector(".country-text");
const tempTxt = document.querySelector(".temp-text");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValue = document.querySelector(".humidity-value");
const windValueTxt = document.querySelector(".wind-value");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");
const forecastItemContainer = document.querySelector(
  ".forecast-items-container"
);

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") updateWeatherInfo(cityInput.value);
  cityInput.value = "";
  cityInput.blur();
});
cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}
function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id == 800) return "clear.svg";
  if (id == 804) return "clouds.svg";
  else return "clear-sky.png";
}
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }

  const {
    name: Country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;
  countryTxt.textContent = Country;
  tempTxt.textContent = Math.round(temp) + "°C";
  humidityValue.textContent = Math.round(humidity) + "%";
  windValueTxt.textContent = Math.round(speed) + " m/s";
  conditionTxt.textContent = main;
  weatherSummaryImg.src = `weather-icons/${getWeatherIcon(id)}`;
  showDisplaySection(weatherInfoSection);
  currentDateElement();
  await updateForecasteInfo(city);
}
async function updateForecasteInfo(city) {
  const forecastsData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T");
  forecastItemContainer.innerHTML = "";
  forecastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecasteItems(forecastWeather);
    }
  });
}
function updateForecasteItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;
  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);
  const forecastItem = `<div class="forecast-item">
            <h5 class="forecast-item-date" regular-txt>${dateResult}</h5>
            <img src="weather-icons/${getWeatherIcon(
              id
            )}"  class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
          </div>`;
  forecastItemContainer.insertAdjacentHTML("beforeend", forecastItem);
}
function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
function currentDateElement() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };
  currentDateTxt.textContent = currentDate.toLocaleDateString("en-GB", options);
  return currentDate;
}
