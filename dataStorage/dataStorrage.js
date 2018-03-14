var filePath = '../dataBase.csv';
var bufferSize =5;
var serialPort = require('serialport'); // serial library
var readLine = serialPort.parsers.Readline; // read serial data as lines

var  fs = require('fs'); // Filesystem access to write the data
var  fd;

var arrayA=[];
var arrayB=[];
var counter=0;
var target = false;
var fileWritten=true;

fs.open(filePath, 'a+', function (err, file) {
  if (err) throw err;
  fd=file;
 console.log("Opened file");
  fs.fstat(fd,function (err, stat) {
    if (err) throw err;
    if(stat.size==0){
      fs.appendFile(fd, "date,value\r\n", function (err) {
        if (err) throw err;
        console.log("File was apparently new created. Wrote first line with keywords.");
     });
    }
  });
});


function writeToFile(array){
for(var entry in array){
  fs.appendFile(fd, array[entry], function (err) {
    if (err) throw err;
  });
}
console.log('File Changes submitted');
array.length=0;
fileWritten=true;
}


//---------------------- SERIAL COMMUNICATION --------------------------------//
// start the serial port connection and read on newlines
const serial = new serialPort('/dev/ttyUSB0', {
 baudRate:115200

});
const parser = new readLine({
  delimiter: '\r\n'
});

// Read data that is available on the serial port and send it to the websocket
serial.pipe(parser);
parser.on('data', function(data) {
  var newEntry = (new Date().toString())+ ','+ data+'\r\n'; // generate a new data entry
  //console.log(newEntry);
  if(target){
    arrayA.push(newEntry);
    counter++;
  }else{
    arrayB.push(newEntry);
    counter++;
  }

  if(counter >=bufferSize && fileWritten){
 console.log('Submitting '+bufferSize+' new entries to be stored.');
    if(target){
      writeToFile(arrayA);
    }else{
      writeToFile(arrayB);
    }
    target= !target;
    counter = 0;
  }
});
//----------------------------------------------------------------------------//
