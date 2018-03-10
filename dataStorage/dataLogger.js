var filePath = '../dataBase.csv';

var serialPort = require('serialport'); // serial library
var readLine = serialPort.parsers.Readline; // read serial data as lines

var unixTime = require('unix-timestamp'); // for exact time stamps

var  fs = require('fs'); // Filesystem access to write the data
var  fd;

var arrayA=[];
var arrayB=[];
var counter=0;
var target = false;
var fileWritten=true;

fs.open(filePath, 'a', function (err, file) {
  if (err) throw err;
  fd=file;
}); 


function writeToFile(array){
for(var entry in array){ 
  fs.appendFile(fd, array[entry], function (err) {
    if (err) throw err;
    console.log('Updated!');
  });
}
array.length=0;
fileWritten=true;

}


//---------------------- SERIAL COMMUNICATION --------------------------------//
// start the serial port connection and read on newlines
const serial = new serialPort('/dev/ttyUSB0', {
 baudRate:9600

});
const parser = new readLine({
  delimiter: '\r\n'
});

// Read data that is available on the serial port and send it to the websocket
serial.pipe(parser);
parser.on('data', function(data) {
  var newEntry = unixTime.now()+ ','+ data+'\r\n';
  if(counter >=10 && fileWritten){
    if(target){
      writeToFile(arrayA);
    }else{
      writeToFile(arrayB);
    }
    target= !target;
    counter = 0;
  } 
  if(target){
arrayA.push(newEntry);
  counter++;
  }else{
arrayB.push(newEntry);
counter++;

   }
 console.log('Data:', newEntry + '  '+ counter+'  '+arrayA.length+'  '+arrayB.length);
});
//----------------------------------------------------------------------------//
