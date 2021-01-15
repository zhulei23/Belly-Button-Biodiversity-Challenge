
// Read into samples.json data
function sampleMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var array= metadata.filter(sampleobject => sampleobject.id == sample);
      var result = array[0]
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });
    
    });
  }

function chart(sample) {

  // Use d3.json to fetch sample data for the plots
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var array = samples.filter(sampleobject => sampleobject.id == sample);
    var result = array[0]

    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;


    // Build Bubble Chart by using the sample data
    var bubble = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };

      var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];

    Plotly.plot("bubble", bubbleData, bubble);

    // Build the bar Chart
    
    var bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
      }
    ];

    var barLayout = {

      margin: { 
          t: 30, l: 150 }
    };

    Plotly.newPlot("bar", bar_data, barLayout);
  });
}
   
 
function init() {
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select option
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample on the list to build the initial plots
    const firstSample = sampleNames[0];
    chart(firstSample);
    sampleMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data when the new sample is selected
  chart(newSample);
  sampleMetadata(newSample);
}

init();
