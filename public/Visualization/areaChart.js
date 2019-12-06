"using strict";

// file for drawing the area chart

// globals
let chartMargin = {top: 50, right: 50, bottom: 50, left: 50},
    chartWidth = 1400 - chartMargin.left - chartMargin.right,
    chartHeight = 350 - chartMargin.top - chartMargin.bottom;

let xChartAxis;
let yChartAxis;
let chartSvg;
let chartLayers;

let areaDateStart = undefined;
let areaDateEnd = undefined;
let updateDataSelection;

let timeRes = "hour";

var xChartScale = d3.scaleTime()
    .domain([new Date, new Date])
    .nice(d3.timeWeek)
    .range([chartMargin.left, chartWidth - chartMargin.right]);

let yChartScale = d3.scaleLinear()
    .domain([0, 1000])
    .range([chartHeight, 0]);

var area = d3.area()
    .x(d => xChartScale(d.data.date))
    .y0(d => yChartScale(d[0]))
    .y1(d => yChartScale(d[1]))
    ;

// color palette
var chartColorScale = d3.scaleOrdinal()
.domain(_.map(g_itemList, "filename"))
.range(_.concat(d3.schemeTableau10, d3.schemeCategory10));

function drawAreaChartInit() {
  d3.select('#area-chart').style("visibility", "hidden");

  chartSvg = d3.select('#areaChartSvg')
  .attr("width", chartWidth + chartMargin.left + chartMargin.right)
  .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
  .append("g")
  .attr("id", "chartGroup")
  .attr("transform", `translate(${chartMargin.left} ,${chartMargin.top})`)
  ;

  chartLayers = chartSvg.append('g')
  .attr("transform", `translate(${chartMargin.left}, 0)`)
  ;

  xChartAxis = chartSvg.append('g')
  .attr("transform", `translate(${chartMargin.left}, ${chartHeight})`)
  .call(d3.axisBottom(xChartScale));

  yChartAxis = chartSvg.append('g')
  .attr("transform", `translate(${chartMargin.left},0)`)
  .call(d3.axisLeft(yChartScale));
}

function resChange() {
  timeRes = document.getElementById("time-res").value;
  updateAreaChart(areaDateStart, areaDateEnd);
}

function rescaleXAxis(startDate, endDate) {
  var tickFormat;
  if (timeRes === "hour") {
    tickFormat = d3.timeHour;
  } else if (timeRes === "minute") {
    tickFormat = d3.timeMinute;
  } else {
    tickFormat = d3.timeSecond;
  }

  xChartScale = d3.scaleTime()
    .domain([startDate, endDate])
    .nice(tickFormat)
    .range([0, chartWidth]);
    xChartAxis.transition().duration(1000).call(d3.axisBottom(xChartScale));
}

function rescaleYAxis(values) {
  var max = 0;
  var keys = getSelectedKeys();
  _.each(values, v => {
    _.each(keys, key => {
      if (v[key] > max) max = v[key];
    });
  });

  yChartScale = d3.scaleLinear()
    .domain([0, max * 0.75])
    .range([chartHeight, 0]);
  yChartAxis.transition().duration(1000).call(d3.axisLeft(yChartScale));
}

function updateAreaChart(startDate, endDate) {
  areaDateStart = startDate;
  areaDateEnd = endDate;
  // show the area chart
  d3.select('#area-chart').style("visibility", "unset");
  if (updateDataSelection) updateDataSelection.remove();

  // rescale the chart to the new dates
  rescaleXAxis(startDate, endDate);
  var keys = getSelectedKeys(); // we only care about the selected keys
  var timeResValues = [];
  if (timeRes === "hour") {
    timeResValues = getDataWithHourResolution(keys, g_dataset, 1, startDate, endDate);
  } else if (timeRes === "minute") {
    timeResValues = getDataWithMinuteResolution(keys, g_dataset, 1, startDate, endDate);
  } else {
    timeResValues = getDataWithSecondResolution(g_dataset, startDate, endDate);
  }
  rescaleYAxis(timeResValues);
  var series = d3.stack().keys(keys)(timeResValues);
  updateDataSelection = chartLayers.selectAll("path")
    .data(series)
    .join("path")
      .attr("fill", ({key}) => chartColorScale(key))
      .attr("d", area)
    .append("title")
      .text(({key}) => key);
}
