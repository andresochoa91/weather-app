const openWeatherApiKey = "115d1787d75817135c5ddd81a0a676f4";
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let tbody =  document.querySelector("tbody");
let info = document.querySelector("#info");
let input = document.querySelector("#city");
let search = document.querySelector("#search");
let cityInput;
let map = L.map("map").setView([37.773972, 	-122.431297], 10);

map.on("click", (event) => {
  let lat = event.latlng.lat;
  let lon = event.latlng.lng;  
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`)
    .then(response => response.json())
    .then(data => {
      let city = data.name;
      let country = data.sys.country;
      let weather = data.weather[0].description;
      generateContent(city, country, lat, lon, weather);
    })
    .catch(err => console.error(err));
});

L.tileLayer("https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=cg31IX4S34d8DeEk9ob3", {
  attribution: `
    <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> 
    <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>
  `,
}).addTo(map);

input.addEventListener("keyup", (event) => {
  cityInput = event.target.value;
});

const performSearch = () => {
  let getCityWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${openWeatherApiKey}`;
  fetch(getCityWeatherUrl)
    .then(response => response.json())
    .then(data => {
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      let city = data.name;
      let country = data.sys.country;
      let weather = data.weather[0].description;
      map.setView(new L.LatLng(lat, lon), 11);
      generateContent(city, country, lat, lon, weather) 
    })
    .catch(err => {
      console.error(`Error: ${err}`);
      alert("No city found")
    });
};

search.addEventListener("click", () => {
  performSearch();
});

input.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    performSearch();
  }
});

const generateContent = (city, country, lat, lon, currentWeather) => {
  generateCurrentWeather(city, country, currentWeather);
  if (city) {
    generateMapMessage(lat, lon, city, country);
    generateWeekTable(lat, lon);
  } else {
    alert("No city found")
  }
}; 

const generateMapMessage = (lat, lon, city, country) => {
  let popup = L.popup()
  .setLatLng([lat, lon])
  .setContent(`
    <div>
    <h6 class="text-center">${city}, ${country}</h6>
    <button class="pb-0 btn btn-success d-block mx-auto" onclick="clickModal()"><h6>Weather info</h6></button>
    </div>
  `)
  .openOn(map);
}; 

const generateCurrentWeather = (city, country, currentWeather) => {
  currentWeather = currentWeather.replace(/^\b(\w)/g, currentWeather[0].toUpperCase());
  info.innerHTML = 
    (city ? `<p><span>City:</span> ${city}</p>` : "") + 
    (country ? `<p><span>Country:</span> ${country}</p>` : "") + 
    `<p id="current-weather" class="mb-3"><span>Current Weather:</span> ${currentWeather}</p>`;
};

const generateWeekTable = (lat, lon) => {
  let weekWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`;
  fetch(weekWeather)
    .then(response => response.json())
    .then(getAllWeek)
    .catch(err => console.error(err)); 
};
  
const getAllWeek = (data) => {
  let days = "";
  for (let i = 0; i < data.daily.length; i++) {               
    let min = data.daily[i].temp.min;
    let max = data.daily[i].temp.max;
    let icon = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
    
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + i);       
    let dayOfWeek = (daysOfWeek[currentDate.getDay()]);
    currentDate = currentDate.toLocaleDateString();         

    days += `
      <tr>
        <td scope="row">${dayOfWeek}. ${currentDate} ${i === 0 ? "(Today)" : ""}</td>
        <td scope="row">${min}</td>
        <td scope="row">${max}</td>
        <td scope="row"><img src="${icon}"></td>
      </tr>
    `;
  }
  tbody.innerHTML = days;
};

const clickModal = () => {
  document.querySelector("#btn-modal").click();
};

