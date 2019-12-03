/*
{
	"946721039":1,
	"946706853":1,
	"946706340":1
}
 */

let cal_dataSet = {};
let cal = new CalHeatMap();

let selectedStart = undefined;
let selectedEnd = undefined;

/******Calendar helper functions ***************/

function onDateClicked(date, count) {
  d3.select(d3.event.target)
  .style("stroke", "black")
  .style("stroke-width", 3);

  if (selectedStart && selectedEnd) {
    var diffStart = Math.abs(selectedStart.date - date);
    var diffEnd = Math.abs(selectedEnd.date - date);
    // update which ever is closest
    if (diffStart < diffEnd) {
      d3.select(selectedStart.element)
      .style("stroke-width", 0);
      selectedStart = {element: d3.event.target, date: date};
    } else {
      d3.select(selectedEnd.element)
      .style("stroke-width", 0);
      selectedEnd = {element: d3.event.target, date: date};
    }
  } else if (selectedStart) {
    if (date < selectedStart.date){
      selectedEnd = selectedStart;
      selectedStart = {element: d3.event.target, date: date};
    } else {
      selectedEnd = {element: d3.event.target, date: date};
    }
  } else {
    selectedStart = {element: d3.event.target, date: date};
  }

  if (selectedStart && selectedEnd) {
    // debugging only
    // console.log("start: " + selectedStart.date.toISOString() + " -> end: " + selectedEnd.date.toISOString());

    updateAreaChart(selectedStart.date, selectedEnd.date);
    updateStackedBarData(selectedStart.date, selectedEnd.date);
  }
}

function sumAllActiveData(data) {
  // console.log(data);
  let sum = 0;
  for (let i in g_itemList) {
    //console.log(i);
    //console.log(g_itemList[i]);
    // console.log(data[g_itemList[i]['filename']]);
    sum += parseInt(data[g_itemList[i]['filename']]);
  }
  // console.log("Sum");
  // console.log(sum);
  return sum;
}

function getCalData() {
  selectedStart = undefined;
  selectedEnd = undefined;
  let data = getDataWithDayResolution();
  var cal_dataSet = {};
  _.each(data, function (d) {
    var dateSeconds = Math.round(d.date.getTime()) / 1000;
    cal_dataSet[dateSeconds] = sumAllActiveData(d);
  });
  return cal_dataSet;
}

function calendarInit() {
  cal.init({
    itemSelector: "#cal-heatmap",
    domain: "month",
    subDomain: "x_day",
    start: new Date(2011, 0, 5),
    data: cal_dataSet,
    cellSize: 15,
    cellPadding: 2,
    domainGutter: 20,
    range: 10,
    domainDynamicDimension: true,
    subDomainTextFormat: "%d",
    legend: [20, 40, 60, 80]
  });
}

function drawCalender() {
  d3.select('#area-chart').style("visibility", "hidden");
  // reset calendar area
  document.getElementById("cal-heatmap").innerHTML = "";
  cal = new CalHeatMap();

  var datas = getCalData();
  var startAndEnd = getStartAndEndDates();
  if (!startAndEnd) return;

  var max = 0;
  _.each(_.values(datas), v => {
    if (v > max) max = v;
  });

  var diffTime = Math.abs(startAndEnd.start - startAndEnd.end);
  var diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  cal.init({
    itemSelector: "#cal-heatmap",
    domain: "month",
    subDomain: "x_day",
    start: startAndEnd.start,
    data: datas,
    cellSize: 15,
    cellPadding: 2,
    domainGutter: 20,
    range: diffMonths,
    domainDynamicDimension: true,
    //previousSelector: "#example-g-PreviousDomain-selector",
    //nextSelector: "#example-g-NextDomain-selector",
    //domainLabelFormat: function(date) {
    //    moment.lang("en");
    //    return moment(date).format("MMMM").toUpperCase();
    //},
    displayLegend: true,
    subDomainTextFormat: "%d",
    browsing: true,
    onClick: onDateClicked,
    legend: [100, max * 0.25, max * 0.50, max * 0.75]
  });
}