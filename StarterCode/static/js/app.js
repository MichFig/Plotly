// Read in the json file
d3.json("samples.json").then((data) => {

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

        // Creating Filter Sample with the Select ID
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

        // Finding the Top 10 OTU_IDS 
        var yAxis = [];
        for (var i = 0; i < xAxis.length; i++) {
            yAxis.push("OTU " + sampleId[i]);
        };

        // Changing the diplay from highest to lowest and checking values
        xAxis.reverse();
        yAxis.reverse();
        label.reverse();

        // Check values
        console.log("xAxis:", xAxis);
        console.log("yAxis:", yAxis);
        console.log("Label:", label);

        // Plot the Horizontal Bar Chart:
        var trace1 = {
            type: "bar",
            x: xAxis,
            y: yAxis,
            text: label,
            name: "OTUs",
            orientation: "h",
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
            }
        };

        var data = [trace1];

        // Layout
        var layout = {
            title: `Test ID No.: ${sample}`,
            xaxis: { title: 'Values' },
            yaxis: { title: 'OTUs' },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Displaying the Bar Chart
        Plotly.newPlot("bar", data, layout);

        // *****************************************************//

        // Craeting Bubble Chart:
        var trace2 = {
            x: sampleId,
            y: sampleValues,
            text: sampleLabel,
            mode: 'markers',
            marker: {
                color: sampleId,
                size: sampleValues,
                sizeref: 0.05,
                sizemode: 'area'
            }
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

    // Function for filling the Demographic Info Box
    function tableBuilder(sample) {

        // Filtering the MetaData by Selected Test ID
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


    // Defining the Changing Button:
    d3.select("#selDataset").on("change", optionChanged);

    // Function of the event for Change Button
    function optionChanged() {
        var testId = d3.select("#selDataset");
        var selectedDropdown = testId.property("value");
        console.log("Selected Drop Down:", selectedDropdown);

        // Creating Bar Chart and Bubble Chart
        horizontalChart(selectedDropdown);

        // Filling Demographic Info Box
        tableBuilder(selectedDropdown);

        // Creating Gauge Chart
        buildGauge(wfreqValue)
    };

    // Setting the default for the first time loading so that the page is not empty
    horizontalChart('940');
    tableBuilder('940');
    buildGauge('2');

});