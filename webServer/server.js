var filePath = "../dataBase.csv" //file path to the dataBase

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;

var ft = require('file-tail'); //Checks for updates to the file after inital load.

var lineReader = require('readline'); // reads a document from a stream line by line.
var fs = require('fs');  // to read in the dataBase.csv as a stream for readline.







//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory


// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a user connected');

  lineReaderInterface = lineReader.createInterface({
    input: fs.createReadStream(filePath)
  });
  lineReaderInterface.on('line', function (line) {
    io.emit('new-line', line);
  });

 ft.startTailing(filePath).on('line', function(line){
   io.emit('new-line', line);
 });
  // if you get the 'disconnect' message, say the user disconnected
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});
//----------------------------------------------------------------------------//
