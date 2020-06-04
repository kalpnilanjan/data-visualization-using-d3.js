/*
    REFERENCES:
    1. https://www.htmlgoodies.com/beyond/javascript/generate-a-bar-chart-with-d3.js.html
    2. https://www.youtube.com/watch?v=5pNz_Dyf9_c
    3. https://www.d3-graph-gallery.com/graph/barplot_button_data_hard.html
*/

// Bar Chart Dimension
var margin = {top: 30, right: 30, bottom: 70, left: 60};
var width = 460 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

// Append svg to div
var svg = d3.select("#svg_container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// Container to group all elements
var g = svg.append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

// Initialize the X axis
var x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
 
var xAxis = g.append("g").attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
    .range([ height, 0]);

var yAxis = g.append("g").attr("class", "yAxis");

// Tooltip 
var tooltip = d3.select('body')
    .append('div')
    .classed('tooltip_div', true);

// Render Data
var degree_data = render_data(data, 'degree_t');
var hsc_data = render_data(data, 'hsc_s');
var mba_data = render_data(data, 'specialisation');
var placement_stats = render_data(data, 'status');

// Initial Visualization
render_chart(degree_data, ['Degree', 'Number of Students']);
render_table(degree_data, ['Degree', 'Number of Students']);

/* 
FUNCTIONS
    1. Render Data: Aggregate data based on categories from the given json data.
    2. Render Chart: Update data in the bar chart based on the option selected.
    3. Render Table: Update data in the table based on the option selected.
    4. Render View: Function to render chart and table with the selected data.
*/

function render_data(data, val){
    var map = new Map();
    data.forEach((element) => {
        var key = element[val];
        if (map.has(key)) {
            map.set(key, map.get(key) + 1);
        } else {
            map.set(key, 1);
        }
    });

    let countData = [];

    for (let [k, v] of map) {
        countData.push({ Key: k, Count: v });
    }
    return countData;
}

function render_chart(data, columns){
    // Update X axis
    x.domain(data.map(function(d) { return d.Key; }));
    xAxis.call(d3.axisBottom(x));

    // Update the Y axis
    y.domain([0, d3.max(data, function(d) { return d.Count }) + 10]);
    yAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(y));

    // Select the element
    var bars = g.selectAll('rect').data(data);

    bars.enter()
        .append('rect')
        .merge(bars)
        .attr('x', function(data) {return x(data.Key)})
        .attr('y', function(data) {return y(data.Count)})
        .attr('height', function(data) {return height - y(data.Count)})
        .attr('width', x.bandwidth())
        .on('mouseover', function(data){
            tooltip.style('opacity', 1);
            tooltip.html(columns[0] + ": " + data.Key + "<br>" + columns[1] + ": " + data.Count)
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY) + 'px')
            d3.select(this).style('opacity', 0.5)
        })
        .on("mouseout", function(data){ 
            tooltip.style("opacity", "0");
            d3.select(this).style('opacity', '1');
        })
        .transition()
        .duration(1000); 

    bars.exit().remove();
}

function render_table(data, columns) {
    var val = ['Key', 'Count'];
    // remove existing table
    d3.select('table').remove();

    var table = d3.select("#table_data").append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");
  
    //Set Up the head of table
    thead
      .append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(function(data) {return data});
  
    // Create row for each object in data
    var rows = tbody.selectAll("tr").data(data).enter().append("tr");
  
    // Create cell in each row for data
    rows
      .selectAll("td")
      .data(function (row) {
        return val.map(function (column) {
          return { column: column, value: row[column] };
        });
      })
      .enter()
      .append("td")
      .text(function (d) {
        return d.value;
      });
}

function render_view(val){
    switch(val){
        case 'degree':
            render_chart(degree_data, ['Degree', 'Number of Students']);
            render_table(degree_data, ['Degree', 'Number of Students']);
            break;
        case 'hsc':
            render_chart(hsc_data, ['HSC Specialization', 'Number of Students']);
            render_table(hsc_data, ['HSC Specialization', 'Number of Students']);
            break;
        case 'mba':
            render_chart(mba_data, ['MBA Specialization', 'Number of Students']);
            render_table(mba_data, ['MBA Specialization', 'Number of Students']);
            break;
        case 'placement':
            render_chart(placement_stats, ['Placement Status', 'Number of Students']);
            render_table(placement_stats, ['Placement Status', 'Number of Students']);
            break;
    }
}
