var vlSpec ={
"$schema": "https://vega.github.io/schema/vega-lite/v2.json",
"data": { "name": "table" },
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
   res.view.change('table', changeSet).run();
}
vegaEmbed("#vis", vlSpec).then(function(res) {
  var socket = io();
  var timeout;
  var newEntries=[];
  socket.on('new-line', function(line) {
    if(timeout!=null){
     clearTimeout(timeout);}
     var newEntry= {'date':line.split(',')[0],'value':line.split(',')[1]};
     newEntries.push(newEntry);
     timeout = setTimeout(reRender, 250,res,newEntries);
  });
});
