const openWeatherApiKey = "115d1787d75817135c5ddd81a0a676f4";
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let tbody =  document.querySelector("tbody");
let info = document.querySelector("#info");
let input = document.querySelector("#city");
let search = document.querySelector("#search");
let tempCity;
let map = L.map("map").setView([37.773972, 	-122.431297], 10);

L.tileLayer("https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=cg31IX4S34d8DeEk9ob3", {
  attribution: `
    <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> 
    <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>
    `,
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
      let weather = data.weather[0].description;
      generateContent(city, country, lat, lon, weather);
    }) 
}

input.addEventListener("keyup", (event) => {
  tempCity = event.target.value;
});

function clickModal () {
  document.querySelector("#btn-modal").click();
}

function generateWeekTable (lat, lon) {
  let weekWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`;
  fetch(weekWeather)
    .then(response => response.json())
    .then(data => {      
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
    })
    .catch(err => console.log(err)); 
}

function generateContent (city, country, lat, lon, currentWeather) {
  info.innerHTML = 
    (city ? `<p><span>City:</span> ${city}</p>` : "") + 
    (country ? `<p><span>Country:</span> ${country}</p>` : "") + 
    `<p id="current-weather" class="mb-3"><span>Current Weather:</span> ${currentWeather}</p>`;
  if (city) {
    let popup = L.popup()
      .setLatLng([lat, lon])
      .setContent(`
      <div>
        <h6 class="text-center">${city}, ${country}</h6>
        <button class="pb-0 btn btn-success d-block mx-auto" onclick="clickModal()"><h6>Weather info</h6></button>
      </div>
        `
      )
      .openOn(map);
    generateWeekTable(lat, lon);
  } else {
    alert("No city found")
  }
} 

search.addEventListener("click", () => {
  let getCityWeather = `https://api.openweathermap.org/data/2.5/weather?q=${tempCity}&appid=${openWeatherApiKey}`;
  fetch(getCityWeather)
    .then(response => response.json())
    .then(data => {
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      map.setView(new L.LatLng(lat, lon), 11);
  
      let city = data.name;
      let country = data.sys.country;
      let weather = data.weather[0].description;
      generateContent(city, country, lat, lon, weather) 
    })
    .catch(err => {
      alert("No city found")
    });
})

input.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    search.click();
  }
})

