const apiKey = "115d1787d75817135c5ddd81a0a676f4";
let tbody =  document.querySelector("tbody");
let info = document.querySelector("#info");
let input = document.querySelector("#city");
let search = document.querySelector("#search");
let tempCity;
let city;
let country;


let geoApiKey = "48a4a872ee984658a60d4d62f4740f1a";
  
var map = L.map("map").setView([37.773972, 	-122.431297], 10);
L.tileLayer("https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=cg31IX4S34d8DeEk9ob3", {
  attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`,
}).addTo(map);

map.on('click', onMapClick);


function onMapClick(event) {
  console.log(event)
  let lat = event.latlng.lat;
  let lon = event.latlng.lng;
  console.log(lat, lon)
  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&key=${geoApiKey}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      let city = data.results[0].components.city;
      let country = data.results[0].components["ISO_3166-1_alpha-2"];
      console.log(country)
      
      generateContent(city, country, lat, lon)
      
      if (city) {
        var popup = L.popup()
          .setLatLng([lat, lon])
          .setContent(city)
          .openOn(map);
      }

    })    
}


input.addEventListener("keyup", (event) => {
  tempCity = event.target.value;
});

function weekTable (lat, lon) {
  document.querySelector("table").classList.remove("d-none");
  let getMinMaxWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(getMinMaxWeather)
    .then(response => response.json())
    .then(data => {
      console.log(data) /* I'M WORKING WITH THIS */
      let days = "";
      for (let i = 0; i < data.daily.length; i++) {
        let min = data.daily[i].temp.min;
        let max = data.daily[i].temp.max;
        let icon = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
        days += `
          <tr>
            <th scope="row">${i}</th>
            <td>${min}</td>
            <td>${max}</td>
            <td><img src="${icon}"></td>
          </tr>
        `;
      }
      tbody.innerHTML = days;
    })
    .catch(err => console.log(err)); 
}

function generateContent (city, country, lat, lon, currentWeather) {
  info.innerHTML = `
    <p><span>City:</span> ${city}</p>
    <p><span>Country:</span> ${country}</p>
    <p><span>Current Weather:</span> ${currentWeather}</p>
  `;
  weekTable(lat, lon);
} 

function weatherInformation (cityWeather) {
  fetch(cityWeather)
    .then(response => response.json())
    .then(data => {
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      city = data.name;
      country = data.sys.country;
      currentWeather = data.weather[0].description;
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
  let getCityWeather = `https://api.openweathermap.org/data/2.5/weather?q=${tempCity}&appid=${apiKey}`;
  weatherInformation(getCityWeather);
})

