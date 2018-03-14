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
    "timeUnit":"utcyearmonthdatehoursminutesseconds",
    "field": "date",
    "type": "temporal"
  },
  "y": {
    "field": "value",
    "type": "quantitative"
  }
}
};


function reRender(res,newEntries){
   console.log('Starting to (re)render the visualization');
   var changeSet = vega.changeset().insert(newEntries);
   console.log(newEntries);
   newEntries.length=0;// once we submitted the changes we clean the entry array
   res.view.change('table', changeSet).run();
}
vegaEmbed("#vis", vlSpec).then(function(res) {
  var socket = io();
  var timeout;
  var newEntries=[];
  var secondBuffer=[];
  socket.on('new-line', function(line) {
    if(timeout!=null && newEntries.length<25){
      clearTimeout(timeout);}
        var newEntry= {'date':line.split(',')[0],'value':line.split(',')[1]};
        newEntries.push(newEntry);
        timeout = setTimeout(reRender, 250,res,newEntries);
    });
});
