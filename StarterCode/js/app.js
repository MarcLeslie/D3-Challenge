var svgWidth = 970;
var svgHeight = 600;

var margin = {
  top: 30,
  right: 30,
  bottom: 40, //must leave this way so that axis labels can show up
  left: 45 //must leave this way so that axis labels can show up
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
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

    // //looking at max and min for fun
    // var ageMax = d3.max(yourData, function(d) { return +d.age;} );
    // console.log(ageMax); 
    
    // var ageMin= d3.min(yourData, function(d) { return +d.age;} );
    // console.log(ageMin); 

    // var smokeMax = d3.max(yourData, function(d) { return +d.smokes;} );
    // console.log(smokeMax); //max smoke % is 26.7

    // var smokeMin= d3.min(yourData, function(d) { return +d.smokes;} );
    // console.log(smokeMin); //min smoke % is 9.7

    //max age is 44.1, min age is 30.5
    //max smoke % is 26.7, min smoke % is 9.7

    //x will be smokers, y will be age
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min (yourData, d => d.smokes) -1  , d3.max(yourData, d => d.smokes) +2 ]) //9 seems to get the circles into the right spot - 9.7 is the min smoker %
        .range([0, width]);  // NO IDEA IF 0 IS THE RIGHT NUMBER
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(yourData, d => d.age) -1 , d3.max(yourData, d => d.age) +2]) //NO IDEA IF 0 IS THE RIGHT NUMBER
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
        .attr("cx" , d => xLinearScale(d.smokes)) //THIS CREATES CIRCLES/DATA
        .attr("cy" , d => yLinearScale(d.age)) //THIS CREATES CIRCLES/DATA
        .attr("r" , "15") //r is radius
        .attr("fill", "red")
        .style("stroke" , "black") //adds border to circles 
        .attr("opacity" , ".8"); 

   //Add in state abbr text to the inside of the circle 

      var textGroup = chartGroup.selectAll(".stateAbbr")
        .data(yourData)
        .enter()
        .append("text")
        .classed("stateAbbr", true) //changed D3 CSS from StateText to StateAbbr to make this make more sense 
        .attr("x", d => xLinearScale(d.smokes))
        .attr("y", d => yLinearScale(d.age))
        .attr('dy', 3)
        .attr("font-size", 12)
        .text(d => d.abbr);

   // Initialize tool tip, event listeners, etc.
    var toolTip = d3.tip()
      .attr("class" , "tooltip")
      .offset([80, -60]) //MESS WITH THIS
      .html(function(d) {
        return(`${d.state}<br> Median Age: ${d.age}<br>Smokers: ${d.smokes}%`); //directions require state abbr
      }); //THIS GIVES YOU TEXT WHEN YOU CLICK ON A BUBBLE 

      chartGroup.call(toolTip); 

      //have text show up when you hover
      circlesGroup.on("mouseover" , function(data) { //change "mouseover" to "click" if you want to click to see the text
        toolTip.show(data, this);
      })
      //on mouse events
      .on("mouseout" , function(data, index) {
        toolTip.hide(data);
      });


      //keep text visible when hovering over the state abbr
      textGroup.on("mouseover" , function(data) { //change "mouseover" to "click" if you want to click to see the text
        toolTip.show(data, this);
      })
      //on mouse events
      .on("mouseout" , function(data, index) {
        toolTip.hide(data);
      });


    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left -5) //mess with this
      .attr("x", 0 - (height / 2)) //this centers it
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Median Age (Years)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top +1})`) //mess with this 
      .attr("class", "axisText")
      .text("Smokers (%)");
      }).catch(function(error) {
      console.log(error);
});
