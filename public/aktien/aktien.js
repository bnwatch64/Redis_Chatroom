let apiKey = "1NPVUKQDTUSJKDS0";

//Create chartjs chart for later use
var ctx = document.getElementById('stockChart').getContext('2d');
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: [], //pass labels
    datasets: [{
      label: "",
      borderColor: 'rgb(145, 154, 161)',
      data: []  //pass data
    }]
  },

  // Configuration options go here
  options: {
    responsive: true,
    aspectRatio: 1.75,
    pointRadius: .25,
    pointHoverRadius: 1,
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
         label: function(tooltipItem) {
                return tooltipItem.yLabel;
         }
      }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'USD'
        }
      }]
    }
  }

});

//set logic for company selector
var rad = document.getElementsByName('companyRadio');
var prev = null;
for (var i = 0; i < rad.length; i++) {

  //Add an event listener to every radio option
  rad[i].addEventListener('change', function(change) {

  //If radio selection changes, plot newly selected companies share history
  let company = change.target.attributes.value.nodeValue;
  plotShareHistory(company);

  });

  //Plot initially selected companies share history
  if (rad[i].checked) plotShareHistory(rad[i].attributes.value.nodeValue);

}


//Fetch share history and pass it to plotData function - if it fails, display an alert
function plotShareHistory(company) {

  //Fetch share history from 'alphavantage' API
  var requestOptions = {
  method: 'GET',
  redirect: 'follow'
  };

  fetch("https://www.alphavantage.co/query?apikey=" + apiKey + "&function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=" + company, requestOptions)
    .then(response => response.json())
    .then(result => {

      plotData(company, result);

    })
    .catch(error => {

      console.log(error);

      let alertContent = `
        <div class="alert alert-dismissible alert-warning" style="display: block;">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <h4 class="alert-heading">Action failed!</h4>
          <p class="mb-0">This page uses the alphavantage API to fetch the data for displaying our share histories. As this API is free to use, it also comes with a limit of calls (max. 5 per minute, 500 per month). It seems like you've reached one of these limits - please try again!</p>
        </div>
      `;

      document.getElementById('alert-box').innerHTML = alertContent;

    });

}

//Update the chartjs chart and stock information box in index.html
async function plotData(company, data) {

  let timeSeries = data["Weekly Adjusted Time Series"];

  //Get data-labels for whole history
  let labels = Object.keys(timeSeries).reverse();

  //Get dataset for current day
  let timeSeriesArray = Object.values(timeSeries);
  var data = [];  //close values as data
  for (var i = timeSeriesArray.length - 1; i >= timeSeriesArray.length - labels.length; i--) {  //Only view data of current day
    let str = timeSeriesArray[i]["5. adjusted close"]
    let flt = parseFloat(str);
    data.push(flt);
  }

  //Calculate max and min value over history
  let max = Math.max.apply(null, data);
  let min = Math.min.apply(null, data);

  //Get most recent stock values
  let recent = await getMostRecentValue(company);

  console.log(recent);

  //Parse HTML for info block
  let newInfo = `
    <table class="table table-hover" style="text-align: center;">
      <tbody>
        <tr class="table-primary">
          <th scope="row">Current Value</th>
          <td>${recent} USD</td>
        </tr>
        <tr class="table-primary">
          <th scope="row">History MAX</th>
          <td>${max} USD</td>
        </tr>
        <tr class="table-primary">
          <th scope="row">History MIN</th>
          <td>${min} USD</td>
        </tr>
      </tbody>
    </table>
  `;

  //Update chartjs chart
  chart.data.labels = labels;
  chart.data.datasets.forEach((dataset) => {
      dataset.label = company;
      dataset.data = data;
  });

  chart.update();
  document.getElementById("companyData").innerHTML = newInfo;

}

//Fetch most recent stock value
async function getMostRecentValue(company) {

  //Fetch most recent stock value from 'alphavantage' API
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  var mostRecentValue;

  await fetch("https://www.alphavantage.co/query?apikey=" + apiKey + "&function=TIME_SERIES_INTRADAY&interval=1min&symbol=" + company, requestOptions)
    .then(response => response.json())
    .then(result => {

      mostRecentValue = Object.values(result["Time Series (1min)"])[0]["4. close"];

    })
    .catch(error => {

      let alertContent = `
        <div class="alert alert-dismissible alert-warning" style="display: block;">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <h4 class="alert-heading">Action failed!</h4>
          <p class="mb-0">This page uses the alphavantage API to fetch the data for displaying our share histories. As this API is free to use, it also comes with a limit of calls (max. 5 per minute, 500 per month). It seems like you've reached one of these limits - please try again!</p>
        </div>
      `;

      document.getElementById('alert-box').innerHTML = alertContent;

    })


  return mostRecentValue;

}
