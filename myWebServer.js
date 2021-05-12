// -----------------------------------------------------------------------------
// This code sets up a basic HTTP Web Server
// As all functional code is written on the client side (explanaition in the documentation),
// the server has no other task than hosting the Bench website
//------------------------------------------------------------------------------
var express = require('express');        // The Web Server is created using the Express package

var app = express();  //Create new Web Server

app.use(express.static(__dirname + '/public')); //Setup the 'public' directory as home

// Let Server listen on port 80
var server = app.listen(80, function() {
  console.log('***********************************');
  console.log('listening:', 80);
  console.log('***********************************');
});
