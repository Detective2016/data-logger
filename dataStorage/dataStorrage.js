var filePath = '../dataBase.csv';
var maxBufferSize =50;
var serialPort = require('serialport'); // serial library
var readLine = serialPort.parsers.Readline; // read serial data as lines

var  fs = require('fs'); // Filesystem access to write the data
var  fd;

var writing=false;
var array=[];
var tempBuffer=[];
var timeOutFunction;
var cancelationCount=0;



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
  timeOutFunction=null;
  writing=true;
  for(var entry in array){
    fs.appendFile(fd, array[entry], function (err) {
      if (err) throw err;
    });
  }
  console.log('File Changes submitted');
  array.length=0;
  writing=false;
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
  var now= new Date(); //Capture the moment the data was recieved.
  var dateString = now.toString(); // get the mainvalues nicley formated
  var finalString= dateString.substring(0,24)+'.'+now.getMilliseconds()+' '+dateString.substring(25,39);// add milliseconds at the right location
  var newEntry = (finalString','+ data+'\r\n'); // generate a new data entry
  if(writing){
     console.log('we get new data - storing it in temp buffer');
    tempBuffer.push(newEntry); // if we are writing from the other buffer
                           // we don't want to add anyhthing new to it
  }
  if(!writing){ /// mostly we wioll just write to the normal buffer
     if(tempBuffer.length>0){// copy over old records
      var length= tempBuffer.length;
       for (var i = 0; i < length; i++) {
         array.push(tempBuffer.shift());
         console.log('copying from tempbuffer');
       }
     }
    array.push(newEntry);
    if(timeOutFunction!=null){
       clearTimeout(timeOutFunction);
       cancelationCount++;
         if (cancelationCount>=maxBufferSize){
           cancelationCount=0;
           console.log('overflowing writing to disk');
           writing=true; //This happens also in side the funtion its just to make sure we do not lose any data
           writeToFile(array);
      }
    }
    timeOutFunction = setTimeout(writeToFile, 1000, array);
  }
});
//----------------------------------------------------------------------------//
