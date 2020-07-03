const openWeatherApiKey = "115d1787d75817135c5ddd81a0a676f4";
let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let tbody =  document.querySelector("tbody");
let info = document.querySelector("#info");
let input = document.querySelector("#city");
let search = document.querySelector("#search");
let tempCity;
let city;
let country;

  
var map = L.map("map").setView([37.773972, 	-122.431297], 10);

L.tileLayer("https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=cg31IX4S34d8DeEk9ob3", {
  attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`,
}).addTo(map);

map.on('click', onMapClick);

function onMapClick(event) {
  let lat = event.latlng.lat;
  let lon = event.latlng.lng;

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`)
    .then(response => response.json())
    .then(data => {
      let city = data.name;
      let country = data.sys.country;

      generateContent(city, country, lat, lon);
    }) 
}


input.addEventListener("keyup", (event) => {
  tempCity = event.target.value;
});

function clickModal () {
  document.querySelector("#btn-modal").click();
}

function weekTable (lat, lon, currentWeather) {
  document.querySelector("table").classList.remove("d-none");
  let getMinMaxWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`;
  fetch(getMinMaxWeather)
    .then(response => response.json())
    .then(data => {
      if (!currentWeather) {
        document.querySelector("#current-weather").innerHTML = `
          <span>Current Weather:</span> ${data.current.weather[0].description}
        `;
      }

      let days = "";

      for (let i = 0; i < data.daily.length; i++) {
               
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i);       
        let dayOfWeek = (daysOfWeek[currentDate.getDay()]);

        if (i === 0) {
          currentDate = "Today";
        } else if (i === 1) {
          currentDate = "Tomorrow";
        } else {
          currentDate = currentDate.toLocaleDateString();         
        }

        let min = data.daily[i].temp.min;
        let max = data.daily[i].temp.max;
        let icon = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
        days += `
          <tr>
            <td scope="row">${dayOfWeek}. ${currentDate}</td>
            <td scope="row">${min} °F</td>
            <td scope="row">${max} °F</td>
            <td scope="row"><img src="${icon}"></td>
          </tr>
        `;
      }
      tbody.innerHTML = days;
    })
    .catch(err => console.log(err)); 
}

function generateContent (city, country, lat, lon, currentWeather) {
  let cityTag = ""
  let countryTag = ""
  if (city) {
    cityTag = `<p><span>City:</span> ${city}</p>`
  }
  if (country) {
    countryTag = `<p><span>Country:</span> ${country}</p>`
  } 
  info.innerHTML = `
    ${cityTag}
    ${countryTag}
    <p id="current-weather" class="mb-3"><span>Current Weather:</span> ${currentWeather}</p>
  `;
  if (city) {
    var popup = L.popup()
      .setLatLng([lat, lon])
      .setContent(
        `
          <p>${city}, ${country}</p>
          <button onclick="clickModal()">Weather info</button>
        `
      )
      .openOn(map);
  }
  weekTable(lat, lon, currentWeather);
} 

function weatherInformation (cityWeather) {
  fetch(cityWeather)
    .then(response => response.json())
    .then(data => {
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      map.setView(new L.LatLng(lat, lon), 11);

      city = data.name;
      country = data.sys.country;
      let currentWeather = data.weather[0].description;
      generateContent(city, country, lat, lon, currentWeather) 
    })
    .catch(err => {
      info.innerHTML = `
        <p>City not found</p>
      `;
      document.querySelector("table").classList.add("d-none");
    });
}

search.addEventListener("click", () => {
  let getCityWeather = `https://api.openweathermap.org/data/2.5/weather?q=${tempCity}&appid=${openWeatherApiKey}`;
  weatherInformation(getCityWeather);
})

input.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    search.click();
  }
})

