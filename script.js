function convertUnixTimestampToTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();
  const formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
  return formattedTime;
}

const getWeather = async (city) => {
  const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "7a1adb0c8dmsh40df7a75b8d7420p1f2650jsne387d11b04e4",
      "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateBackground = (temperature) => {
  const body = document.body;

  if (temperature >= 30) {
    body.style.backgroundColor = "#F6F1D8";
  } else if (temperature >= 20) {
    body.style.backgroundColor = "#00B2F5";
  } else if (temperature >= 10) {
    body.style.backgroundColor = "#8493BC";
  } else {
    body.style.backgroundColor = "#475763";
  }
};

const updateWeatherForCatania = async (city = "Catania") => {
  const weatherData = await getWeather(city);

  cityName.innerHTML = city;
  temp.innerHTML = weatherData.temp ;
  feels_like.innerHTML = weatherData.feels_like 
  humidity.innerHTML = weatherData.humidity ;
  min_temp.innerHTML = weatherData.min_temp;
  max_temp.innerHTML = weatherData.max_temp ;
  wind_speed.innerHTML = weatherData.wind_speed ;
  wind_degrees.innerHTML = weatherData.wind_degrees ;

  const isValidTimestamp = (timestamp) =>
    !isNaN(timestamp) && timestamp !== null && timestamp !== undefined;

  const updateLiveTemperature = () => {
    temp.innerHTML = weatherData.temp || "N/A";
    updateBackground(parseFloat(weatherData.temp));
  };
  setInterval(updateLiveTemperature, 60000);

  updateLiveTemperature();

  sunrise.innerHTML = isValidTimestamp(weatherData.sunrise)
    ? convertUnixTimestampToTime(
        weatherData.sunrise,
        weatherData.timezone_offset
      )
    : "N/A";
  sunset.innerHTML = isValidTimestamp(weatherData.sunset)
    ? convertUnixTimestampToTime(
        weatherData.sunset,
        weatherData.timezone_offset
      )
    : "N/A";

  updateBackground(parseFloat(weatherData.temp));
};

const fillTableWithData = async () => {
  const cityNames = ["Rome", "Dallas", "Amsterdam", "Dubai", "Delhi", "Paris"];

  const promises = cityNames.map(async (city) => {
    const weatherData = await getWeather(city);
    return { city, weatherData };
  });

  const cityWeatherDataList = await Promise.all(promises);

  const tableBody = document.getElementById("city_row");
  cityWeatherDataList.forEach(({ city, weatherData }) => {
    const row = document.createElement("tr");
    row.id = `${city}-row`;

    const cell = (content) => {
      const td = document.createElement("td");
      td.textContent = content;
      return td;
    };

    row.appendChild(cell(city));
    row.appendChild(cell(weatherData.temp));
    row.appendChild(cell(weatherData.feels_like));
    row.appendChild(cell(weatherData.humidity));
    row.appendChild(cell(weatherData.min_temp));
    row.appendChild(cell(weatherData.max_temp));

    tableBody.appendChild(row);
  });
};

const fetchData = async () => {
  await updateWeatherForCatania();
  await fillTableWithData();
};

fetchData();

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  const cityInput = document.getElementById("city");
  const city = cityInput.value;

  const weatherData = await getWeather(cityInput.value);
  if (weatherData) {
    updateWeatherForCatania(city);
  }
});
