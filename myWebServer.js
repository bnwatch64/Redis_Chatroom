//------------------------------------------------------------------------------
// In this file...
// the main web server for the chat room is created
// all Redis publish and subscribe events are handled
// all socket.io events are handled
// all web end points are defined
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// PROJECT INIT
//------------------------------------------------------------------------------


// Import general dependencies
var env = require('node-env-file');
var bodyParser = require('body-parser');

// Init web server using Express and HTTP
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Init socket.io for real time event based communication
var io = require('socket.io')(server);

// Init redis connection as specified in inc/redis.js
var redis = require('./inc/redis');

// Set environment
env('.env');

// Set views folder for pug files
app.set('views', 'views');
// Use pug (Jade) as view engine
app.set('view engine', 'pug');
// Set public folder for JavaScript and CSS
app.use(express.static('public'));
// Use bodyParser for easier request parsing
app.use(bodyParser.urlencoded({
     extended: true
}));

// Create local variables for holding user and message information
var all_messages = [];
var all_users = [];


//------------------------------------------------------------------------------
// REDIS FUNCTIONS
//------------------------------------------------------------------------------


// Get all messages stored in Redis
function getMessages() {

     // Create Promise for Redis data fetch
     var promise = new Promise(function(resolve, reject) {
          redis.generalClient.get('all_messages', function(err, reply) {
               if (reply) {
                    all_messages = JSON.parse(reply);
                    resolve();
               } else {
                    resolve();
               }
          });
     });

     // Return created Promise
     return promise;

}

// Get all users stored in Redis
function getUsers() {

     // Create Promise for Redis data fetch
     var promise = new Promise(function(resolve, reject) {
          redis.generalClient.get('all_users', function(err, reply) {
               if (reply) {
                    all_users = JSON.parse(reply);
                    resolve();
               } else {
                    resolve();
               }
          });
     });

     // Return created Promise
     return promise;

}

// Redis subscribe to message and users channel
redis.subscriber.subscribe('messages');
redis.subscriber.subscribe('all_users');

// Listen for messages through Redis publisher/subscriber and channel them to active users using socket.io
redis.subscriber.on('message', function(channel, message) {
     if (channel === 'messages') {
          io.sockets.emit('message', JSON.parse(message));
     } else {
          io.sockets.emit('users', JSON.parse(message));
     }
});


//------------------------------------------------------------------------------
// DEFINE GET ENDPOINTS
//------------------------------------------------------------------------------


// Render homepage (views/index.pug) at GET '/'
app.get('/', function(request, response) {
     response.render('index');
});

// Render chat room (views/room.pug) at GET '/chat/:username'
app.get('/chat/:username', function(request, response) {
     response.render('room', {
          user: request.params.username
     })
});

// Return all messages at GET '/messages'
app.get('/messages', function(request, response) {
     getMessages().then(function() {
          response.send(all_messages);
     });
});

// Return all users at GET '/users'
app.get('/users', function(request, response) {
     getUsers().then(function() {
          response.send(all_users);
     });
});


//------------------------------------------------------------------------------
// DEFINE POST/DELETE ENDPOINTS
//------------------------------------------------------------------------------


// Register user at POST '/user'
app.post('/user', function(request, response) {

     // Update local array all_users
     var userPromise = getUsers();

     if (all_users.indexOf(request.body.user) === -1) {
          // If user doesn't already exist, create and welcome him/her

          // Create welcome message for new user
          var msg = {
               'message': request.body.user + " has joined the chat - Say Hello!",
               'user': 'system'
          };

          // Update local array all_messages
          var messagesPromise = getMessages();

          // Wait for updating of local users and messages array
          Promise.all([userPromise, messagesPromise]).then(function() {
               // Add new user and welcome message to local arrays
               all_users.push(request.body.user);
               all_messages.push(msg);

               // Add new user and welcome message to Redis for persistence
               redis.generalClient.set('all_users', JSON.stringify(all_users));
               redis.generalClient.set('all_messages', JSON.stringify(all_messages));

               // Use Redis publisher/subscriber to publish new user and welcome message
               redis.publisher.publish('all_users', JSON.stringify(all_users));
               redis.publisher.publish('messages', JSON.stringify(msg));

               // Respond to client with Success
               response.send({
                    'status': 200,
                    'message': 'User joined'
               });
          });

     } else {
          // If user already exists, respond to client with Error

          response.send({
               'status': 403,
               'message': 'User already exist'
          });

     }

});


// Remove user at DELETE '/user'
app.delete('/user', function(request, response) {

     // Update local array all_users
     var userPromise = getUsers();

     if (all_users.indexOf(request.body.user) !== -1) {
          // If user exists, remove and say goodbye to him/her

          // Create goodbye message for user
          var msg = {
               'message': request.body.user + " has left the chat",
               'user': 'system'
          };

          // Update local array all_messages
          var messagesPromise = getMessages();

          // Wait for updating of local users and messages array
          Promise.all([userPromise, messagesPromise]).then(function() {
               // Remove user from local array
               all_users.splice(all_users.indexOf(request.body.user, 1));
               // Add goodbye message to local array
               all_messages.push(msg);

               // Remove user from Redis for persistence
               redis.generalClient.set('all_users', JSON.stringify(all_users));
               // Add goodbye message to Redis for persistence
               redis.generalClient.set('all_messages', JSON.stringify(all_messages));

               // Use Redis publisher/subscriber to publish new 'all_users' and goodbye message
               redis.publisher.publish('messages', JSON.stringify(msg));
               redis.publisher.publish('all_users', JSON.stringify(all_users));

               // Respond to client with Success
               response.send({
                    'status': 200,
                    'message': 'User removed'
               });
          });

     } else {
          // If user doesn't exist, respond to client with Error

          response.send({
               'status': 403,
               'message': 'User does not exist'
          });

     }

});


// Post a message at POST '/message'
app.post('/message', function(request, response) {

     // Create message to publish and save
     var msg = {
          'message': request.body.msg,
          'user': request.body.user
     };

     // Wait for update on local array all_messages
     getMessages().then(function() {
          // Add new message to local array
          all_messages.push(msg);

          // Add new message to Redis for persistence
          redis.generalClient.set('all_messages', JSON.stringify(all_messages));

          // Use Redis publisher/subscriber to publish new message
          redis.publisher.publish('messages', JSON.stringify(msg));

          // Respond to client with Success
          response.send("Message sent");
     });

});


//------------------------------------------------------------------------------
// START THE SERVER
//------------------------------------------------------------------------------


// Get user and message data stored on Redis
getUsers();
getMessages();

// Start server on port specified in environment file
server.listen(process.env.APP_PORT, function() {
     console.log("Server started");
});
