
window.onload = () => {

    getCountryData();
    getHistoricalData();
    getWortldCoronaData();
    
}

//funcion para inicializar google maps
let map;
let infoWindow;
let coronaGlobalData;
let mapCircles = [];
var casesTypeColors = {
    cases: '#1d2c4d',
    active: '#9d80fe',
    recovered: '#7dd71d',
    deaths: '#fb4443'
}
  
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
        lat: 34.80746,
        lng: -40.4796
    },
    zoom: 3,
    styles: mapStyle
  });
  infoWindow = new google.maps.InfoWindow();
}

const changeDataSelection = (casesType) => {
    clearTheMap();
    showDataOnMap(coronaGlobalData, casesType);
}

const clearTheMap = () => {
    for(let circle of mapCircles){
        circle.setMap(null);
    }
}

//funcion para obtener la data de la api
const getCountryData = () => {
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        coronaGlobalData = data;
        showDataOnMap(data);
        showDataInTable(data);
    })
}

const getWortldCoronaData = () => {
    fetch("https://disease.sh/v2/all")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        // buildPieChart(data);
        setStatsData(data);
    })
}

const setStatsData = (data) => {
    let addedCases = numeral(data.todayCases).format('+0,0');
    let addedRecovered = numeral(data.todayRecovered).format('+0,0');
    let addedDeaths = numeral(data.todayDeaths).format('+0,0');
    let totalCases = numeral(data.cases).format('0.0a');
    let totalRecovered = numeral(data.recovered).format('0.0a');
    let totalDeaths = numeral(data.deaths).format('0.0a');
    document.querySelector('.total-number').innerHTML = addedCases;
    document.querySelector('.recovered-number').innerHTML = addedRecovered;
    document.querySelector('.deaths-number').innerHTML = addedDeaths;
    document.querySelector('.cases-total').innerHTML = `${totalCases} Total`;
    document.querySelector('.recovered-total').innerHTML = `${totalRecovered} Total`;
    document.querySelector('.deaths-total').innerHTML = `${totalDeaths} Total`;
}

const getHistoricalData = () => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
       let chartData = buildChartData(data);
       buildChart(chartData);
    })
}
const showDataOnMap = (data, casesType="cases") => {
    
    data.map((country)=>{
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        const countryCircle = new google.maps.Circle({
            strokeColor: casesTypeColors[casesType],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: casesTypeColors[casesType],
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: country[casesType] /2
          });

          mapCircles.push(countryCircle);

          var html = `
          <div class="info-container">
            <div class="info-flag" style="background-image: url(${country.countryInfo.flag})">
                
            </div>
            <div class="info-name">
                ${country.country}
            </div>
            <div class="info-confirmed">
               Total: ${country.cases}
            </div>
            <div class="info-recovered">
               Recovered: ${country.recovered}
            </div>
            <div class="info-deaths">
               Deaths: ${country.deaths}
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

const showDataInTable = (data) => {
    var html = '';
    data.forEach((country)=>{
        html += `
        <tr>
            <td>${country.country}</td>
            <td>${country.cases}</td>
            <td>${country.recovered}</td>
            <td>${country.deaths}</td>
        </tr>
        `
    })
    document.getElementById('table-data').innerHTML = html;
}
