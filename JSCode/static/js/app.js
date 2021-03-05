// Read in the json file
d3.json("../data/samples.json").then((data) => {

    // Check data
    console.log(data);

    // Assign variables and check data
    var names = data.names;
    console.log("Names:", names);

    var metaData = data.metadata;
    console.log("MetaData:", metaData);

    var sampleData = data.samples;
    console.log("SampleData:", sampleData);

    // Get data for dropdown menu 
    var dropDown = d3.select("#selDataset");
    names.forEach((name) => {
        var cell = dropDown.append("option");
        cell.text(name);
    });


    // Horizontal Bar Chart and Bubble Chart
    function horizontalChart(sample) {

        // Filter with the Select ID
        var filterSample = [];
        filterSample = sampleData.filter(data => data.id === sample);
        console.log(filterSample);

        // Filtering with sampleId, sampleValues & sampleLabel
        var sampleId = [];
        var sampleValues = [];
        var sampleLabel = [];

        filterSample.forEach(info => {
            Object.entries(info).forEach(([key, value]) => {

                switch (key) {
                    case ("otu_ids"):
                        sampleId = value.map(y => y);
                        console.log("sample ID:", sampleId);
                        break;

                    case ("sample_values"):
                        sampleValues = value.map(x => x);
                        console.log("sample value:", sampleValues);
                        break;

                    case ("otu_labels"):
                        sampleLabel = value.map(label => label);
                        console.log("sample Labels:", sampleLabel);
                        break;
                };

            });
        });

        // Finding Top 10 
        var xAxis = sampleValues.slice(0, 10);
        var label = sampleLabel.slice(0, 10);
        var yAxis = [];
        for (var i = 0; i < xAxis.length; i++) {
            yAxis.push("OTU " + sampleId[i]);
        };

        // Display highest to lowest and checking values
        xAxis.reverse();
        yAxis.reverse();
        label.reverse();

        // Check values
        console.log("xAxis:", xAxis);
        console.log("yAxis:", yAxis);
        console.log("Label:", label);

        // Set the data for Horizontal Bar Chart:
        var trace1 = {
            x: xAxis,
            y: yAxis,
            orientation: 'h',
            type: 'bar',
            width: .75,
            text: label,
            marker: {
                color: [
                    "#e4f0f6",
                    "#bcd9ea",
                    "#8bbdd9",
                    "#5ba4cf",
                    "#298fca",
                    "#0079bf",
                    "#026aa7",
                    "#055a8c",
                    "#094c72",
                    "#0c3953"
                ]
            },
        };

        var data = [trace1];

        // Layout
        var layout = {
            title: `Test ID No.: ${sample}`,
            xaxis: { title: 'Values' },
            yaxis: { title: 'Microbial Species' },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Display Chart
        Plotly.newPlot("bar", data, layout);

        // *****************************************************//

        // Bubble Chart:
        var trace2 = {
            x: sampleId,
            y: sampleValues,
            mode: 'markers',
            text: sampleLabel,
            marker: {
                color: sampleId,
                size: sampleValues,
                colorscale: 'Portland'
            },
            type: 'scatter'
        };


        var data2 = [trace2];

        // Apply the mode to the layout
        var layout2 = {
            title: `Test ID No.: ${sample}`,
            showlegend: false,
            xaxis: {
                title: "OTU IDs",
                showgird: true
            },
        };

        // Displaying the Bubble Chart
        Plotly.newPlot("bubble", data2, layout2);
    };

    // *****************************************************//

    // Function for Demographic Info 
    function demoBox(sample) {

        // Filter MetaData by Selected Test ID
        var filterSample = [];
        filterSample = metaData.filter(data => data.id == sample);
        console.log("filtered MetaData:", filterSample);

        // Assigning the variable based on the class of panel-body in html
        var table = d3.select(".panel-body");
        table.html("");

        // Filling the Demographic Info Box:
        filterSample.forEach(info => {

            // Adding rows
            var row = table.append("tr");

            // Finding the key and value of the filter metaData and filling the rows
            Object.entries(info).forEach(([key, value]) => {

                var row = table.append("tr");
                var cell = row.append("td");

                cell.text(`${key}: ${value}`);

                // Finding the value of wfreq for passing later to the buildGauge Function

                if (key === 'wfreq') {
                    wfreqValue = value;
                };

            });
        });
    };

    // *************************************************** //


    // Change Buttons:
    d3.select("#selDataset").on("change", optionChanged);

    // Function of the event for Change Button
    function optionChanged() {
        var testId = d3.select("#selDataset");
        var selectedDropdown = testId.property("value");
        console.log("Selected Drop Down:", selectedDropdown);

        // Bar Chart and Bubble Chart
        horizontalChart(selectedDropdown);

        // Demographic Info 
        demoBox(selectedDropdown);


    // ***********Add Gauge Chart from Bonus*************** //
        // Gauge Chart
        washGauge(wfreqValue);
        
    };
 // ***********BONUS************************************** //
    // Creating Gauge Chart
    function washGauge(wfreq) {

        var level = parseFloat(wfreq) * 20;
        var degrees = 180 - level;
        var radius = 0.5;

        // Angle of Needle
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path for pie pieces
        var mainPath = "M -.0 -0.05 L .0 0.05 L ";
        var pathX = String(x);
        var space = " ";
        var pathY = String(y);
        var pathEnd = " Z";
        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        // Circle on Guage
        var data = [
            {
                type: "scatter",
                x: [0],
                y: [0],
                marker: { size: 25, color: "#000000" },
                showlegend: false,
                name: "Washing Frequency",
                text: level
               
            },
            {
                values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
                rotation: 90,
                text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                textinfo: "text",
                textposition: "inside",
                marker: {

                    colors: [
                        "#1a9850",
                        "#66bd63",
                        "#a6d96a",
                        "#d9ef8b",
                        "#ffffbf",
                        "#fee08b",
                        "#fdae61",
                        "#f46d43",
                        "#d73027",
                        "#ffffff"
                    ]

                },

                labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                hole: .4,
                type: "pie",
                showlegend: false
            }
        ];


        var layout = {
            shapes: [
                {
                    type: "path",
                    path: path,
                    fillcolor: "#000000",
                    line: {
                        color: "#000000"
                    }
                }
            ],
            title: "Belly Button Washing Frequency <br> Cleanouts per Week",
            height: 500,
            width: 500,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            }
        };
        // Display Gauge Chart
        Plotly.newPlot("gauge", data, layout);
    
    };


    // Setting the default 
    horizontalChart('940');
    demoBox('940');
    washGauge('2');

});
