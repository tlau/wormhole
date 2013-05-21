var holla = require('holla');
var http = require('http');
var express = require('express');

var app = express()
app.use(express.static(__dirname + "/public"))

var server = http.createServer(app).listen(8080);
var rtc = holla.createServer(server, {debug: true, presence: true});

console.log('Holla server listening on port 8080');
