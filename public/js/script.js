//------------------------------------------------------------------------------
// In this file the frontend code for the homepage (login page) is located
//------------------------------------------------------------------------------


$(document).ready(function() {

     // Action on 'Join Room' button press
     $('.join').on("submit", function(e) {

          // Prevent default behaviour
          e.preventDefault();

          // Disable submit button
          $('#submitButton').prop('disabled', true);

          // Send http request for user registration to POST '/user'
          $.post('/user', {
                    user: $('#userInput').val()
               })
               .done(function(response) {
                    if (response.status === 200) {
                         // If user registration was successful

                         // Get and proceed to chat room view via http request GET '/chat/:username'
                         window.location = 'chat/' + $('#userInput').val();

                    } else {
                         // If user registration was not successful

                         // Re-Enable submit button
                         $('#submitButton').prop('disabled', false);

                         // Create 'username taken' alert above form
                         $('body').prepend('<div class="alert alert-warning"><h4 class="alert-heading">Warning!</h4><p class="mb-0">Username already taken! Please use another one.</p></div>');

                         // Set timetout for alert
                         setTimeout(function() {
                              $('.alert.alert-warning').fadeOut(500, function() {
                                   $(this).remove();
                              })
                         }, 2000)

                    }

               });

     });

});
