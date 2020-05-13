function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  });
}
  
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  
function buildMetadata(sample) {
d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    //const entries = Object.entries(result);
    Object.entries(result).forEach(([key, value]) =>
    {PANEL.append("h6").text(key + " : " + value);});
});
}

function buildCharts(sample){

    // Get that data from the json file
    d3.json("samples.json").then((data) => {
        
        // Filter data to get just the object matching users input in the sample varible
        var samp = data.samples;
        var resultArray = samp.filter((sampleObj) => sampleObj.id == sample);
        console.log(resultArray);
        
        // Use map to get just the sample values from the object
        var mappedData = resultArray.map(sampVals => sampVals.sample_values);
        console.log(mappedData);
        // Slice the data to get the top ten results
        var slicedValData = mappedData[0].slice(0,10);
        // Reverse the data for a cleaner look
        slicedValData = slicedValData.reverse();
        console.log(slicedValData);
        // Use map to get just the otu_id values
        var mappedIdVals = resultArray.map(idVals => idVals.otu_ids);
        slicedIdVals = mappedIdVals[0].slice(0,10);
        slicedIdVals = slicedIdVals.reverse();
        console.log(slicedIdVals);
        //Use map to get just the otu_labels
        var mappedLabels = resultArray.map(labelVals => labelVals.otu_labels);
        slicedLabelVals = mappedLabels[0].slice(0,10);
        slicedLabelVals = slicedLabelVals.reverse();
        console.log(slicedLabelVals);

        // Convert ints to Strings to use as y-labels
        yVals = slicedIdVals.map(converString => converString = "OTU " + converString);
        // trace for sample data
        console.log(yVals);
        var trace1 = {
            x: slicedValData,
            y: yVals,
            text: slicedLabelVals,
            name: "Please Work",
            type: "bar",
            orientation: "h"
        };

        var plotData = [trace1];
        
        var layout = {
            title: "Greek gods search results",
            margin: {
              l: 200,
              r: 200,
              t: 100,
              b: 100
            }
          };
        // Render the plot to the div tag "bar"
        Plotly.newPlot("bar", plotData);


        //var sampVals = data.samples;
        //sortedSamps = sampVals.sort((a,b) => parseFloat(a.otu_ids) - parseFloat(b.otu_ids))
        //console.log(sortedSamps)});
    
    });
}
    /*data.sort(function(a, b) {
        return parseFloat(b.samples.otu_ids) - parseFloat(a.samples.otu_ids);
          }));
        
        data = data.slice(0,10);


    */



  
  init();


