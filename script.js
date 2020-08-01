
window.onload = () => {

    getCountryData();
}

//funcion para inicializar google maps
let map;
let infoWindow;
  
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: -34.397,
      lng: 150.644
    },
    zoom: 8
  });
  infoWindow = new google.maps.InfoWindow();
}
//funcion para obtener la data de la api
const getCountryData = () => {
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        showDataOnMap(data);
    })
}

const showDataOnMap = (data) => {
    data.map((country)=>{
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        const countryCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: country.casesPerOneMillion * 15
          });

          var html = `
          <div class="info-container">
            <div class="info-flag">
                <img src="${country.countryInfo.flag}"
            </div>
            <div class="info-name">
                ${country.country}
            </div>
            <div class="info-confirmed">
                ${country.cases}
            </div>
            <div class="info-recovered">
                ${country.recovered}
            </div>
            <div class="info-deaths">
                ${country.deaths}
            </div>
          </div>
          `

          var infoWindow = new google.maps.InfoWindow({
              content: html,
              position: countryCircle.center
          });

          google.maps.event.addListener(countryCircle, 'mouseover', function() {
            infoWindow.open(map);
          });

          google.maps.event.addListener(countryCircle, 'mouseout', function(){
              infoWindow.close();
          })

    })


    
}

