var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(yourData) {

    //Convert age and smokes to numeric data 
    yourData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    }); 

    console.log(yourData); //ALL the data is present now (not just smnokes and age)

    //x will be smokers, y will be age
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(yourData, d => d.smokes)]) //NO IDEA IF 20 IS THE RIGHT NUMBER
        .range([0, width]);  // NO IDEA IF 0 IS THE RIGHT NUMBER
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(yourData, d => d.age)]) //NO IDEA IF 0 IS THE RIGHT NUMBER
        .range([height, 0]);  // NO IDEA IF 0 IS THE RIGHT NUMBERS 

    //axis functions
    var bottomAxis = d3.axisBottom(xLinearScale); 
    var leftAxis = d3.axisLeft(yLinearScale); 

    //append axes to chart
    chartGroup.append("g")
        .attr("transform" , `translate(0, ${height})`)
        .call(bottomAxis); 
    
    chartGroup.append("g")
        .call(leftAxis); 

    //create some circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(yourData)
        .enter()
        .append("circle")
        .attr("cx" , d => xLinearScale(d.smokes))
        .attr("cy" , d => yLinearScale(d.age))
        .attr("r" , "15")
        .attr("fill", "red")
        .attr("opacity" , ".8"); 

   // Initialize tool tip, event listeners, etc.
    var toolTip = d3.tip()
      .attr("class" , "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return(`${d.abbr}<br> Median Age: ${d.age}<br>Smokers %: ${d.smokes}`);
      }); //THIS GIVES YOU TEXT WHEN YOU CLICK ON A BUBBLE 

      chartGroup.call(toolTip); 

      circlesGroup.on("click" , function(data) {
        toolTip.show(data, this);
      })
      //on mouse events
      .on("mouseout" , function(data, index) {
        toolTip.hide(data);
      });

          // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Smokers (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Median Age");
    }).catch(function(error) {
    console.log(error);


});
