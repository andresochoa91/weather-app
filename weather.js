let apiKey = "115d1787d75817135c5ddd81a0a676f4";
let input = document.querySelector("#city");
let search = document.querySelector("#search");
let tempCity;
let city;
let country;

fetch(`https://api.openweathermap.org/data/2.5/weather?&appid=${apiKey}`)
  .then(response => response.json())
  .then(console.log)

input.addEventListener("keyup", (event) => {
  tempCity = event.target.value;
});

let info = document.querySelector("#info");

search.addEventListener("click", () => {
  let getCityWeather = `https://api.openweathermap.org/data/2.5/weather?q=${tempCity}&appid=${apiKey}`
  fetch(getCityWeather)
    .then(response => response.json())
    .then(data => {
      document.querySelector("table").classList.remove("d-none");
      console.log(data)
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      let getMinMaxWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      city = data.name;
      country = data.sys.country;
      currentWeather = data.weather[0].description; 
      info.innerHTML = `
        <p><span>City:</span> ${city}</p>
        <p><span>Country:</span> ${country}</p>
        <p><span>Current Weather:</span> ${currentWeather}</p>
      `;

      fetch(getMinMaxWeather)
      .then(response => response.json())
      .then(data => {
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
          document.querySelector("tbody").innerHTML = days;
        }) 

    })
    .catch(err => {
      info.innerHTML = `
        <p>City not found</p>
      `;
      document.querySelector("table").classList.add("d-none");
    });
})
