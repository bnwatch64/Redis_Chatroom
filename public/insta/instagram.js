//These tokens normaly would not be written stored in plain code due to security reasons. For further information, check the documentation.
let longAccessToken = "IGQVJWZAUE0MTlsR2NNTk51ZAmRxUTVWOWxxM1h2NFRGYUcyOVBxaXJWdnR6UjlsWWt3WllpYVBQbm1MLWd6QTV2WW5fWGhHRUp6UXAzb1lRdHM2SUtNOFVWbk5RRHJNZAFZAEeTItOU5n";
let userID = "17841400897289599";

//Add listener to "show images"
document.getElementById("button").addEventListener("click", function() {

  getAndDisplayFromProfile()

});

//Get and display pictures once on load
getAndDisplayFromProfile();

//Fetches an array of media from the Instagram Basic API via an access token and passes the response data to displayPictures function
function getAndDisplayFromProfile() {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  //Get all media from linked Instagram account via long-term access token
  fetch("https://graph.instagram.com/me/media?fields=caption,media_type,media_url,permalink,username&access_token=" + longAccessToken, requestOptions)
    .then(response => response.json())
    .then(data => {

      var mediaArray = data.data;

      //Display the pictures in a grid
      displayPictures(mediaArray);

    })

}

//Checks the Instagram Basic Display API response and parses HTML to display all pictures of linked profile
function displayPictures(mediaArray) {

  var leftColumn = '';
  var rightColumn = '';
  for (var i = 0; i < mediaArray.length; i++) {

    let currentMedia = mediaArray[i];

    //Skip media if not picture
    if (currentMedia.media_type != "IMAGE") continue;

    var newPicture = `
      <a href="${currentMedia.permalink}">
        <div class="overlay-container">
          <img src="${currentMedia.media_url}" alt="Avatar" class="image" style="width:100%">
          <div class="middle">
            <blockquote class="blockquote">
              <h2>Caption</h2>
              <p class="mb-0">${currentMedia.caption}</p>
              <footer class="blockquote-footer">&commat;${currentMedia.username}</cite></footer>
            </blockquote>
          </div>
        </div>
      </a>`
    ;

    //Write to left and right column consecutively
    if (i % 2 == 0) leftColumn += newPicture;
    else rightColumn += newPicture;

  }

  let finalContent = `
    <div class="grid-row">
      <div class="grid-column">
        ${leftColumn}
      </div>
      <div class="grid-column">
        ${rightColumn}
      </div>
    </div>
  `;

  document.getElementById("output").innerHTML = finalContent;

}
