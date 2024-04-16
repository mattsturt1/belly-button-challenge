function buildMetadata(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
    
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (key in result){
      PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
    };
      
  });
}  
function buildCharts(sample) {
  
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart
    let bubbleLayout = {
      x: [1, 2, 3, 4],
      y: [10, 11, 12, 13],
      mode: 'markers',
      marker: {
        size: [40, 60, 80, 100]
      }
    };
    
    let bubbleData = [
      {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: 'Earth'
          }
      }
  ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      } 
    ];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 } 
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
};


function buildGauge(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let metadata = data.metadata;
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];

      let wfreq = result.wfreq;

      var degrees = 180 - (20 * wfreq),
          radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);

      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
          pathX = String(x),
          space = ' ',
          pathY = String(y),
          pathEnd = ' Z';
      var path = mainPath.concat(pathX, space, pathY, pathEnd);

      var data = [
          {
              type: 'scatter',
              x: [0], y: [0],
              marker: { size: 28, color: '850000' },
              showlegend: false,
              name: 'Washes',
              text: wfreq,
              hoverinfo: 'text+name'
          },
          {
              type: 'pie',
              showlegend: false,
              hole: .5,
              rotation: 90,
              values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
              text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ''],
              direction: 'clockwise',
              textinfo: 'text',
              textposition: 'inside',
              marker: {
                  colors: ['#d8f3dc', '#b7e4c7', '#95d5b2', '#74c69d', '#52b788', '#40916c', '#2d6a4f', '#1b4332', '#081c15', 'white']
              },
              hoverinfo: 'label'
          },
          {
              type: 'scatter',
              showlegend: false,
              hoverinfo: 'skip',
              x: [0], y: [0],
              marker: { size: 12, color: '850000' },
              mode: 'lines',
              line: {
                  color: '850000',
                  width: 4
              },
              rotation: 90,
              textposition: 'inside',
              x0: 'center',
              y0: 'center',
              x: [0, x],
              y: [0, y],
              text: wfreq.toString(),
              hoverinfo: 'text'
          }
      ];

      var layout = {
          shapes: [{
              type: 'path',
              path: path,
              fillcolor: '850000',
              line: {
                  color: '850000'
              }
          }],
          title: 'Belly Button Washing Frequency',
          height: 500,
          width: 500,
          xaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
          yaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] }
      };

      Plotly.newPlot('gauge', data, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let sampleNames = data.names;

    for (let i = 0; i < sampleNames.length; i++){
      selector
        .append("option")
        .text(sampleNames[i])
        .property("value", sampleNames[i]);
    };

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
      buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();