const file = "samples.json"

// Fetch the JSON data and console log it
d3.json(file).then(function(data) {
  console.log(data);
});

// Promise Pending
const dataPromise = d3.json(file);
console.log("Data Promise: ", dataPromise);
