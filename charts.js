const buildChartData = (data) => {
    let chartData = [];
    let lastDataPoint;
    for(let date in data.cases){
        if(lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data.cases[date] - lastDataPoint
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data.cases[date];
    }
    return chartData;
}

const buildPieChart = (data) => {
    var ctx = document.getElementById('myPieChart').getContext('2d');
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: [data.active, data.recovered, data.deaths],
            backgroundColor: [
                '#9d80fe',
                '#7dd71d',
                '#fb4443'
            ]
            }],
            labels: [
                'Active',
                'Reacovered',
                'Deaths'
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

const buildChart = (chartData) => {
    var timeFormat = 'MM/DD/YY';
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Casos Totales',
                backgroundColor: 'rgba(204, 16, 52, 0.5)',
                borderColor: '#CC1034',
                data: chartData
            }]
        },
    options: {
        maintainAspectRatio: false,
        tooltips: {
            mode: 'index',
            intersect: false
        },
        elements: {
            point:{
                radius: 0
            }
        },

        scales:   {
            xAxes: [{
                type:    "time",
                time:    {
                    format: timeFormat,
                    tooltipFormat: 'll'
                },
            }],
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return numeral(value).format('0a');
                    }
                }
            }]
        }
    }
});
}