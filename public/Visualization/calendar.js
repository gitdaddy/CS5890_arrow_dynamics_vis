
let cal_dataSet = {};
let cal = new CalHeatMap();

let currentSelectedYear = undefined;
let currentMaxValue = 0;
let gTime;

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
    updateAreaChart(selectedStart.date, selectedEnd.date);
    drawStackedBar(selectedStart.date, selectedEnd.date);
  }
}

function sumAllActiveData(data) {
  let sum = 0;
  for (let i in g_itemList) {
    sum += parseInt(data[g_itemList[i]['filename']]);
  }
  return sum;
}

function setCalDataset() {
  selectedStart = undefined;
  selectedEnd = undefined;
  let data = getDataWithDayResolution();
  cal_dataSet = {};
  _.each(data, function (d) {
    var dateSeconds = Math.round(d.date.getTime()) / 1000;
    cal_dataSet[dateSeconds] = sumAllActiveData(d);
  });
}


function calendarInit() {
  gTime = d3
  .select('div#slider-time')
  .append('svg')
  .attr('width', 500)
  .attr('height', 55)
  .append('g')
  .attr('transform', 'translate(30,10)');

  cal.init({
    itemSelector: "#cal-heatmap",
    domain: "month",
    subDomain: "x_day",
    start: new Date(2011, 0, 5),
    data: cal_dataSet,
    cellSize: 15,
    cellPadding: 2,
    domainGutter: 20,
    range: 12,
    domainDynamicDimension: true,
    subDomainTextFormat: "%d",
    legend: [20, 40, 60, 80]
  });
}

function resetDates(){
  selectedStart = undefined;
  selectedEnd = undefined;
  drawCalender();
}

function drawCalender() {
  d3.select('#calendar').style("visibility", "unset");
  d3.select('#stacked-bar').style("visibility", "hidden");

  setCalDataset();
  var startAndEnd = getStartAndEndDates();
  if (!startAndEnd) return;

  // Year slider
  var range = startAndEnd.end.getFullYear() - startAndEnd.start.getFullYear();
  if (range > 0) {
    d3.select('div#slider-time').style("visibility", "unset");
    currentSelectedYear = startAndEnd.start.getFullYear();
    var dataTime = d3.range(0, range + 1).map(function(d) {
      return new Date(startAndEnd.start.getFullYear() + d, 0, 1);
    });
    var sliderTime = d3
      .sliderBottom()
      .min(d3.min(dataTime))
      .max(d3.max(dataTime))
      .step(1000 * 60 * 60 * 24 * 365)
      .width(300)
      .tickFormat(d3.timeFormat('%Y'))
      .tickValues(dataTime)
      .default(new Date(1998, 10, 3))
      .on('onchange', val => {
        if (val.getFullYear() !== currentSelectedYear) {
          selectedStart = undefined;
          selectedEnd = undefined;
          currentSelectedYear = val.getFullYear();
          setHeatMap(new Date(currentSelectedYear, 0, 1));
        }
      });

    gTime.call(sliderTime);
  } else {
    d3.select('div#slider-time').style("visibility", "hidden");
  }

  _.each(_.values(cal_dataSet), v => {
    if (v > currentMaxValue) currentMaxValue = v;
  });

  setHeatMap(new Date(startAndEnd.start.getFullYear(), 0, 1));
}

function setHeatMap(startDate) {
  d3.select('#area-chart').style("visibility", "hidden");
  // reset calendar area
  document.getElementById("cal-heatmap").innerHTML = "";
  cal = new CalHeatMap();

  cal.init({
    itemSelector: "#cal-heatmap",
    domain: "month",
    subDomain: "x_day",
    start: startDate,
    data: cal_dataSet,
    cellSize: 15,
    cellPadding: 2,
    domainGutter: 20,
    range: 12, // 12 months
    domainDynamicDimension: true,
    displayLegend: true,
    subDomainTextFormat: "%d",
    browsing: true,
    onClick: onDateClicked,
    legend: [100, currentMaxValue * 0.25, currentMaxValue * 0.50, currentMaxValue * 0.75]
  });

  drawTotalStackedBar();
}