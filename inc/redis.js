//------------------------------------------------------------------------------
// In this file the connection to the Redis database is established
//------------------------------------------------------------------------------

// Import dependencies
var redis = require('redis');
var env = require('node-env-file');
// Set working environment
env('.env');

// Create Redis publisher and subscriber for event based communication
var publisher = redis.createClient(process.env.REDIS_URL);
var subscriber = redis.createClient(process.env.REDIS_URL);
// Creade general Redis client for persistence
var generalClient = redis.createClient(process.env.REDIS_URL);

exports.publisher = publisher;
exports.subscriber = subscriber;
exports.generalClient = generalClient;
