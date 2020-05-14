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
    var washFreq = result.wfreq;
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    //const entries = Object.entries(result);
    Object.entries(result).forEach(([key, value]) =>
    {PANEL.append("h6").text(key + " : " + value);});

// Multiply wash frequency by 180/9 and and adjust pointer so its accurate
    if (washFreq === 0) {
      var level = washFreq * 20;
    } else if(washFreq ===1){
      level = washFreq * 20 + 3;
    } else if(washFreq ===2){
      level = washFreq * 20 + 7;
    } else if(washFreq ===3){
      level = washFreq * 20 + 6;
    } else if(washFreq ===5){
      level = washFreq * 20 - 2;
    } else if(washFreq ===6){
      level = washFreq * 20 - 5;
    } else if(washFreq ===7){
      level = washFreq * 20 - 7;
    } else{
      level = washFreq * 20;
    }
      // Multiply wash frequency by 180/9 and subtract 10 to center pointer
  //var level = washFreq * 20 - 10;

  // Trig to calc meter point
  var degrees = 180 - level,
      radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
  var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
  // Path: may have to change to create a better triangle
  var mainPath = path1,
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data3 = [{ type: 'scatter',
    x: [0], y:[0],
      marker: {size: 14, color:'850000'},
      showlegend: false,
      name: 'Wash Frequency',
      text: level,
      hoverinfo: 'text+name'},
    { values: [1,1,1,1,1,1,1,1,1,9],
    rotation: 90,
    text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1'],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgb(42, 161, 6)', 'rgba(42, 161, 6, 0.8)',
                          'rgba(42, 161, 6, 0.7)', 'rgba(42, 161, 6, 0.6)',
                          'rgba((42, 161, 6, 0.5)','rgba((42, 161, 6, 0.4)',
                          'rgba((42, 161, 6, 0.3)','rgba((42, 161, 6, 0.2)',
                          'rgba((42, 161, 6, 0.1)','rgb(255, 255, 255)']},
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    title: "Frequency of Naval Cleaning per Week",
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
      margin: {
        l: 0,
        r: 0,
        t: 85,
        b: 0
      },
    height: 400,
    width: 400,
    xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data3, layout);

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
        var bubbleSampData = mappedData[0];
        // Slice the data to get the top ten results
        var slicedValData = mappedData[0].slice(0,10);
        // Reverse the data for a cleaner look
        slicedValData = slicedValData.reverse();
        console.log(slicedValData);
        // Use map to get just the otu_id values
        var mappedIdVals = resultArray.map(idVals => idVals.otu_ids);
        var bubbleIdData = mappedIdVals[0];
        slicedIdVals = mappedIdVals[0].slice(0,10);
        slicedIdVals = slicedIdVals.reverse();
        console.log(slicedIdVals);
        //Use map to get just the otu_labels
        var mappedLabels = resultArray.map(labelVals => labelVals.otu_labels);
        slicedLabelVals = mappedLabels[0].slice(0,10);
        slicedLabelVals = slicedLabelVals.reverse();
        console.log(slicedLabelVals);

        // --- BAR PLOT ---
        // Convert ints to Strings to use as y-labels
        yVals = slicedIdVals.map(converString => converString = "OTU " + converString);

        // Bar plot trace
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

        // Bar plot layout object
        var layout2 = {
            title: "10 Most Common Naval Cultures from Volunteer " + sample,
            margin: {
              l: 85,
              r: 0,
              t: 85,
              b: 0
            }
          };
        // Render the plot to the div tag "bar"
        Plotly.newPlot("bar", plotData,layout2);

        // --- BUBBLE PLOT ---


        var trace2 = {
            x: bubbleIdData,
            y: bubbleSampData,
            text: slicedLabelVals,
            mode: "markers",
            marker: {
                color: bubbleIdData,
                size: bubbleSampData
            }
        };

        var bubblePlot = [trace2];
        var layout2 = {
            title: 'Naval Bacteria Cultures from Volunteer ' + sample,
            xaxis: {
              title: {
                text: 'Bacteria ID'
              }
            },
            yaxis: {
              title: {
                text: 'Bacteria Count'
              }
            },
            showlegend: false,
            height: 600,
            width: 1100
          };

        Plotly.newPlot('bubble', bubblePlot, layout2)
    });
}
  init();


