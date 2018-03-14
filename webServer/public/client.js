var firstBuffer=[];
var secondBuffer=[];
var lock=false;
var renderThread=null;

var vlSpec ={
"$schema": "https://vega.github.io/schema/vega-lite/v2.json",
"data": { "name": "table","format": {
      "parse": {
        "date": "utc:'%Q'"
      }
    }
   },
"width": 1000,
"height":500,
"mark": "line",
"encoding": {
  "x": {
    "timeUnit":"utcyearmonthdatehoursminutessecondsmilliseconds",
    "field": "date",
    "type": "temporal"
  },
  "y": {
    "field": "value",
    "type": "quantitative"
  }
}
};


function reRender(res){
  console.log('startedRendering');
  while(secondBuffer.length>0 || firstBuffer.length>0){
    
   lock=true;
   if(secondBuffer.length>0){

     while(secondBuffer.length>0){
      // console.log('Pushing data from'+secondBuffer.length+' to '+firstBuffer.length);
        firstBuffer.push(secondBuffer.shift());
      }
   }
   lock=false;
   var changeSet = vega.changeset().insert(firstBuffer);
   res.view.change('table', changeSet).run();
   firstBuffer.length=0;
  }
}

vegaEmbed("#vis", vlSpec).then(function(res) {
  var socket = io();

  socket.on('new-line', function(line) {
    console.log('gettingData');
    var newEntry= {'date':line.split(',')[0],'value':line.split(',')[1]};
    console.log('created new entry');
    while(lock){console.log('waiting for lock relise');}
    secondBuffer.push(newEntry);
    if(renderThread == null){
      console.log('startingThread');
      renderThread=setTimeout(reRender, 1000,res);
    }

    });
});
