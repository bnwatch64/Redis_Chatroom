var accessToken = "BQA95FFClRgeV6UhPXlTKIO6ivTj2xFGyYLS-CAyo0jwrVlfgDbo9IoC8MrI-giel2-QW6OO4fpNoQqSV1rtLU_YveeMD4ETyqKIbGhhbJl7Uc6nAIJHO2V4HZ7ie6loxiNYzA4OuQtNTYlbvyj1h_aZHmxW0zr7mUSanN6deeKP1J7mAXtvOJXDzoVVXcbUxUFgZAVrhQuWOYIN9LcUjVbGDCHfB3MZz2KOuHPKMn8zekmKKNj7AjMyrObtKgEUb6JM3q-a9FEPCAONdYlBdoWw6E4vldeJGWu5sMG1_Cg";
var refreshToken = "AQCHoO8ZNHYPM3re17ZgVTucLVoglExWWSw8qU0VB0-5CiBsDRIjhGffEDo0G9khBsUA2aRI2BgoVWoy4Oe7jqTNA59ghU0xKgh9D493pVQDtep2gNZzcxRKGFzBMLZ5vns";

displayMyPodcasts();

document.getElementById("button").addEventListener("click", async function() {

  displayMyPodcasts();

});

function displayMyPodcasts() {

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + accessToken);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://api.spotify.com/v1/me/shows", requestOptions)
    .then(response => {

      if (!response.ok) throw new Error("Access Token denied, try to refresh.")
      else return response.json();

    })
    .then(data => {

      let listOfShows = data.items;
      writeToPage(listOfShows);

    })
    .catch(error => {

      refreshAndTryAgain();

    });

}

function refreshAndTryAgain() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YTg1MjcyZWQzMjgwNDY3MGI4MjFiY2IzMDc2MGY1M2E6ZDk2ZWZiNzBlNWJmNDUwNTlkNTk4YWFlMGE1Zjg5OWU=");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Cookie", "inapptestgroup=; __Host-device_id=AQAPXrEulg964asiotcIafa-k-1Gdklm4ajeoVTsApUnGuKhDox5BGYceMUuMNO1h1xJWJsZJ6KB3xkzqiKoy-Q5c5rhp8ipLx0; __Secure-TPASESSION=AQDqyo8DzuerMTgE+9W0tPIic+1kgVCehWKpTdnpcLB5FVy3KbWOmYr7zHT3+FRLRyc8KJomRNWcS4c4+KLjrJFF4ceptBXwuYQ=; csrf_token=AQAblcvE1QfbxVyA2eHcAnobRXzPvsFpUDJuGv_EYrmmpea6XkRlztczLJIH-kgPEIAj5Ui0vZkFo15z");

  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("refresh_token", refreshToken);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then(response => response.json())
    .then(data => {

      accessToken = data.access_token;

      displayMyPodcasts();

    })
    .catch(error => console.log('error', error));
}

function writeToPage(listOfShows) {

  var newHTML = '<table class="table table-hover" style="text-align: center; table-layout: fixed;"><thead><tr><th scope="col">Name</th><th scope="col">Cover</th><th scope="col">Description</th><th scope="col">Link</th></tr></thead><tbody>';

  for (var i = 0; i < listOfShows.length; i++) {
    var currentShow = listOfShows[i].show;

    if (i % 2 == 0) newHTML += '<tr class="table-primary">';
    else newHTML += '<tr>';

    newHTML += '<th scope="row" style="vertical-align: middle;">' + currentShow.name + '</th>';
    newHTML += '<td style="vertical-align: middle;"><img src="' + currentShow.images[1].url + '" style="max-width: 100%; height:auto;"></img></td>';
    newHTML += '<td style="vertical-align: middle;"><p>' + currentShow.description + "</p></td>";
    newHTML += '<td style="vertical-align: middle;">' + '<p class="lead"><a class="btn btn-primary btn-lg" href="' + currentShow.external_urls.spotify + '" role="button">Click here</a></p></td></tr>';
  }

  newHTML += '</tbody></table>';

  document.getElementById("output").innerHTML = newHTML;

}
