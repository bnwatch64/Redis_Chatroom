//------------------------------------------------------------------------------
// In this file the frontend code for the chat room page is located
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// FUNCTIONS
//------------------------------------------------------------------------------


// Send new message to server
function sendMessage(user, msg) {
     // Send message to server using http request on POST '/message'
     $.post('/message', {
               user: user,
               msg: msg
          })
          .done(function() {
               // Clear message textarea after success
               $('.message').val('');
               // Re-Enable 'Send' button
               $('.submit').prop('disabled', false);
          });
}

// Append new message to chat box
function displayMessage(user, message) {
     if (user === 'system') {
          // If user is 'system', only print the message in italic
          $('.chat').append('<p class="item"><span class="msg", style="font-style: italic;">' + message + '</span></p>');
     } else {
          // If user is not 'system', print user and message
          $('.chat').append('<p class="item"><span class="user">' + user + ': </span><span class="msg">' + message + '</span></p>');
     }

     // Scroll chat box all the way up to reveal new entry
     $('.chat').animate({
          'scrollTop': 999999
     }, 200);
}


//------------------------------------------------------------------------------

// Wait for page ready
$(document).ready(function() {


//------------------------------------------------------------------------------
// WEB SOCKETS CONFIGURATION
//------------------------------------------------------------------------------


// Create web socket with socket.io for real time communication to server
var socket = io();

// Action for event on socket.io 'message' channel
socket.on('message', function(data) {
     // Append message to chat box
     displayMessage(data.user, data.message);
});

// Action for event on socket.io 'users' channel
socket.on('users', function(data) {
     // Update the 'Online Users' box

     // Clear the box
     $('.users .item').remove();

     $.each(data, function(index, value) {
          // Iterate over every user returned by the server and append him/her to the list
          $('.users').append('<p class="item">' + value + '</span>');
     });
});


//------------------------------------------------------------------------------
// PAGE INIT
//------------------------------------------------------------------------------


// Send http request to GET '/messages' to get all messages
$.get('/messages')
     .done(function(response) {
          $.each(response, function(index, value) {
               // Iterate over every message object returned by the server and display it
               displayMessage(value.user, value.message);
          });
     });

// Send http request to GET '/users' to get all active users in the room
$.get('/users')
     .done(function(response) {
          $.each(response, function(index, value) {
               // Iterate over every user returned by the server and append him/her to the list
               $('.users').append('<p class="item">' + value + '</p>');
          });
     });


//------------------------------------------------------------------------------
// CALLBACK HANDLING
//------------------------------------------------------------------------------


// Action on key press while in 'message' textarea
$('.room .message').on("keydown", function(e) {

     if (e.keyCode === 13) {
          // Prevent line-break in message textarea
          e.preventDefault();

          // If key is 'Enter', send message
          sendMessage($('.name').val(), $('.message').val());
     }

});

// Action on 'Send' button press
$('.room').on("submit", function(e) {

     // Prevent default behavior ob 'Submit' button
     e.preventDefault();

     // Send message
     sendMessage($('.name').val(), $('.message').val());

});

// Action on window/tab close
window.onbeforeunload = function() {
     // Delelte the active user from the list

     // Send http request to DELETE '/user' for deleting user on server side
     $.ajax({
               method: 'DELETE',
               url: '/user',
               data: {
                    user: $('.name').val()
               }
          })
          .done(function(msg) {
               alert(msg.message);
          });

     return null;
};


//------------------------------------------------------------------------------

});
