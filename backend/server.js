var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var MongoClient = require('mongodb').MongoClient,
  Grid = MongoClient.Grid;

var backend = new ShareDB();
createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples', 'textarea');
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create({content: ''}, callback);
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.use(express.static('static'));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8080);
	/*
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 8000;
  }
  app.listen(port);*/

  console.log('Listening on http://localhost:8080');
}

function put() {
  // Connect to the db
  MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
    if(err) return console.dir(err);

    var grid = new Grid(db, 'fs');
    var buffer = new Buffer(input);
    grid.put(buffer, {metadata:{category:'text'}, content_type: 'text'}, function(err, fileInfo) {
      if(!err) {
        console.log("Finished writing file to Mongo");
      }
    });
  });
}
