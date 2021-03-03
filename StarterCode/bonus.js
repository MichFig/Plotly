// Creating Gauge Chart
function buildGauge(wfreq) {
    // Enter the washing frequency between 0 and 180
    // We have 9 steps so 180 / 9 = 20
    var level = parseFloat(wfreq) * 20;

    // Trig to calc meter point
    // To calculate the location of Trig from 0
    var degrees = 180 - level;

    // Length of Trig
    var radius = 0.5;

    // Angle of Trig for each WFREQ
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = "M -.0 -0.05 L .0 0.05 L ";
    var pathX = String(x);
    var space = " ";
    var pathY = String(y);
    var pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    // Setting the circle at the center of Trig
    var data = [
    {
        type: "scatter",
        x: [0],
        y: [0],
        marker: { size: 20, color: "#f2096b" },
        showlegend: false,
        name: "Washing Frequency",
        text: level,
        hoverinfo: "text+name"
    },
    {
        // Top Half of the circle should be divided to 9 section
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],

        // To show the chart horizontally
        rotation: 90,

        // Inside text for each section, the last one which is for the bottom half of the chart should be null
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: "text",
        textposition: "inside",

        // Everything should be set from right to left
        
        marker: {
        // Colour of each section of the chart
        colors: [
            "#85b788",
            "#8bbf8f",
            "#8dc386",
            "#b7cf90",
            "#d5e79a",
            "#e5e9b0",
            "#eae8ca",
            "#f5f2e5",
            "#f9f3ec",
            "#ffffff"
        ]
        
        },
        // Labels of each section of the chart
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
    }
    ];

    // Set of Trig shape and color and location in the chart
    var layout = {
    shapes: [
        {
        type: "path",
        path: path,
        fillcolor: "#f2096b",
        line: {
            color: "#f2096b"
        }
        }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1,1]
    },
    yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
    }
    };
// Displaying the Guage Chart
    Plotly.newPlot("gauge", data, layout);
};

