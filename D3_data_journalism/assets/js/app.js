// D3 Homework - Data Journalism and D3
// By: Jahangir Dewan
//
// Function to automatically Resizes the Chart
function makeAutomatic() {

  // setup SVG (Scalable Vector Graphics) with D3 call
  //
  var svgArea = d3.select("body").select("svg");

  // check if savgArea not emaply then remove or clear svg before 
  // loadeing new chart
  //
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  
  // Initialize chart variables: width and height
  // set vaiables for svg width and height
  var svgWidth = 980;
  var svgHeight = 600;

  // Setup margin for SVG 
  var margin = {
    top: 30,
    right: 40,
    bottom: 100,
    left: 100
  };

  // Calculate width and height of chart area
  //
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Setup SVG Wrapper: using D3 to select body, append SVG area with width and height
  // attribute
  //
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  //  Setup chartGroup by appending group element, set Margins.
  //  Translate the axes into the appropriate location for left and top margin
  //
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Setup initial parameters for the chart to be plotted 
  //
  var selectedXAxis = "poverty";
  var selectedYAxis = "healthcare";

  // Define xScale(): Function to update xScale once axis label is been clicked
  //
  function xScale(censusData, selectedXAxis) {
    // set scale for xais for the Chart using selectedXAxis variable
    //
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[selectedXAxis]) * 0.8,
        d3.max(censusData, d => d[selectedXAxis]) * 1.2
      ])
      .range([0, width]);
    return xLinearScale;
  }

  // Function for Updating yScale Upon Click on Axis Label
  function yScale(censusData, selectedYAxis) {
    // Create Scale Functions for the Chart (selectedYAxis)
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[selectedYAxis]) * 0.8,
        d3.max(censusData, d => d[selectedYAxis]) * 1.2
      ])
      .range([height, 0]);
    return yLinearScale;
  }

  // Function to update xAxis while click on label
  //
  function updateXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }

  // Function to update yAxis once while click on label
  //
  function updateYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }

  // Function to update and render circles Group based on axis selection
  //
  function updateCircles(circlesGroup, newXScale, selectedXAxis, newYScale, selectedYAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[selectedXAxis]))
      .attr("cy", d => newYScale(d[selectedYAxis]));
    return circlesGroup;
  }

  // Function to update Text Group with transition to new text
  //
  function updateText(textGroup, newXScale, selectedXAxis, newYScale, selectedYAxis) {
    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[selectedXAxis]))
      .attr("y", d => newYScale(d[selectedYAxis]))
      .attr("text-anchor", "middle");
    return textGroup;
  }

  // Function to update circles group with New Tooltip based 
  // on user selections of axis labels
  //
  function updateToolTip(selectedXAxis, selectedYAxis, circlesGroup, textGroup) {
    if (selectedXAxis === "poverty") {
      var xLabel = "Poverty (%)";
    }
    else if (selectedXAxis === "age") {
      var xLabel = "Age (Median)";
    }
    else {
      var xLabel = "Household Income (Median)";
    }
    if (selectedYAxis === "healthcare") {
      var yLabel = "Lacks Healthcare (%)";
    }
    else if (selectedYAxis === "obesity") {
      var yLabel = "Obese (%)";
    }
    else {
      var yLabel = "Smokes (%)";
    }

    // toolTip Initiakization
    //
    var toolTip = d3.tip()
      .attr("class", "tooltip d3-tip")
      .offset([90, 90])
      .html(function(d) {
        return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[selectedXAxis]}<br>${yLabel} ${d[selectedYAxis]}`);
      });

    // Create Circles Tooltip for the Chart
    circlesGroup.call(toolTip);

    // Create an Event to Display information on mouse over the circle
    //
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // on mouseout Event to hide info
      //
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    // Create Text Tooltip in the Chart
    textGroup.call(toolTip);
    // Create Event Listeners to Display and Hide the Text Tooltip
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // on mouseout Event to hide information
      //
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    return circlesGroup;
  }

  // Read data from the data.csv File and perforrm operations
  //
  d3.csv("assets/data/data.csv")
    .then(function(censusData) {

    // Parse censusData for each column and create the data structure
    //
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

    // Define xLinearScale and yLinearScale variables for the chart
    //
    var xLinearScale = xScale(censusData, selectedXAxis);
    var yLinearScale = yScale(censusData, selectedYAxis);

    // Define Axis for the Chart
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Define xAnis: append xAxis to the chart using chartGrup function that is defined earlier
    //
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // Define yAxis: append yAxis to the chart 
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    // Define circlessGroup: create and append initial circles
    //
    var circlesGroup = chartGroup.selectAll(".stateCircle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[selectedXAxis]))
      .attr("cy", d => yLinearScale(d[selectedYAxis]))
      .attr("class", "stateCircle")
      .attr("r", 20)
      .attr("stroke", "black")
      .attr("opacity", ".75")
      .attr("fill", "salmon");

    // Define textGropu: append text to circles
    //
    var textGroup = chartGroup.selectAll(".stateText")
      .data(censusData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[selectedXAxis]))
      .attr("y", d => yLinearScale(d[selectedYAxis]*.98))
      .text(d => (d.abbr))
      .attr("class", "stateText")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");

    //---------------------------------------------------------------------
    // Define xLabelsGroup for 3 xAxis labels by using chartGroup.append()
    //---------------------------------------------------------------------
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
      // Define "povertyLabel" var and append text
    var povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // get the value 
      .classed("active", true)
      .text("Poverty (%)");

    // Define ageLabel var and append text
    //
    var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // get the value 
      .classed("inactive", true)
      .text("Age (Median)");

    // Define incomeLabel var and append text
    //
    var incomeLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // get the value 
      .classed("inactive", true)
      .text("Household Income (Median)");

    //---------------------------------------------------------------------
    // Define yLabelsGroup for 3 xAxis labels by using chartGroup.append()
    //---------------------------------------------------------------------
    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(-25, ${height / 2})`);

    // Define healthcareLabel var and append text, attribute, etc.
    //
    var healthcareLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", 0)
      .attr("value", "healthcare")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    // Define smokesLabel var and append text, attribute, etc.
    //
    var smokesLabel = yLabelsGroup.append("text") 
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0)
      .attr("value", "smokes")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("inactive", true)
      .text("Smokes (%)");

    // Define smokesLabel var and append text, attribute, etc.
    //
    var obesityLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", 0)
      .attr("value", "obesity")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("inactive", true)
      .text("Obese (%)");

    // Define circlesGroup and updateToolTip Function with all the parameters  as below
    //
    var circlesGroup = updateToolTip(selectedXAxis, selectedYAxis, circlesGroup, textGroup);

    // Create xAxis Labels Event Listener with value
    //
    xLabelsGroup.selectAll("text")
      .on("click", function() {
        // Get value by selecting with "value" attribute
        //
        var value = d3.select(this).attr("value");
        if (value !== selectedXAxis) {
          // Update selectedXAxis with Value
          selectedXAxis = value;

          // Updates xScale with new data for the selectedXAxis
          xLinearScale = xScale(censusData, selectedXAxis);

          // Updates xAxis with transition
          xAxis = updateXAxes(xLinearScale, xAxis);

          // Updates Circles based on selected new values
          circlesGroup = updateCircles(circlesGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);
          
          // Updates Text based on selected new values
          textGroup = updateText(textGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis)
          
          // Updates Tooltips based on selected new values
          circlesGroup = updateToolTip(selectedXAxis, selectedYAxis, circlesGroup, textGroup);

          // Using classed to change text to bold on selcted text
          //
          if (selectedXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (selectedXAxis === "age") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
    
     
    // Create yAxis Labels Event Listener with value
    //
    yLabelsGroup.selectAll("text")
      .on("click", function() {
        // Define value based on selection
        var value = d3.select(this).attr("value");

      // If new new value is not ealier selectedYAxis value then ...
        if (value !== selectedYAxis) {
          // Replaces selectedYAxis with Value
          selectedYAxis = value;

          // Updates yScale with new data
          yLinearScale = yScale(censusData, selectedYAxis);
          // Updates yAxis with transition
          yAxis = updateYAxes(yLinearScale, yAxis);

          // Updates Circles based on selected new values
          circlesGroup = updateCircles(circlesGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis);
          
          // Updates Text with new data
          textGroup = updateText(textGroup, xLinearScale, selectedXAxis, yLinearScale, selectedYAxis)
          
          // Updates Tooltips with new data 
          circlesGroup = updateToolTip(selectedXAxis, selectedYAxis, circlesGroup, textGroup);
          
          // Using classed to change text to bold on selcted text
          //
          if (selectedYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (selectedYAxis === "obesity") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  });
}

// Once browser is loaded then call makeAutomatic() to perforrm all the options 
// to plot the chart and results
makeAutomatic();

// When browser Window is resizecd then makeAutomatic() is Called 
// 
d3.select(window).on("resize", makeAutomatic);