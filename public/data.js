"use strict";

/*
# python 2
python -m SimpleHTTPServer
# python 3
python -m http.server
*/

let fileDataSet = {}

// global dataset of records ordered by date of recording
// [ {date: Alarmclock:, CoffeeMaker: ... key3: , key4 ...} ]
let g_dataset = [];

let areaChartId = "area-chart";

Date.prototype.addHours = function(h){
  this.setHours(this.getHours()+h);
  return this;
}

function getDateObj(str) {
  var dateStr = str.split(" ");
  var dateArray = dateStr[0].split("/");
  var timeArray = dateStr[1].split(":");
  // new Date(year, month, day, hours, minutes, seconds, milliseconds);
  return new Date(
    parseInt(dateArray[2]),
    parseInt(dateArray[0]),
    parseInt(dateArray[1]),
    parseInt(timeArray[0]),
    parseInt(timeArray[1]),
    parseInt(timeArray[2]));
}

// returns the data vales array
// with hour sum intervals
function getDataWithHourResolution(keys, valuesArray, numHours = 1) {
  // go to the next interval and sum all of the
  // values for each interval
  var curDate = new Date(valuesArray[0].date.getTime());
  var hoursResRecords = [];
  curDate.addHours(numHours);
  var sumObj = createNewDatasetRecord("", curDate);
  _.each(valuesArray, function(secondResRecord) {
    if (secondResRecord.date > curDate) {
      // update hour record
      hoursResRecords.push(sumObj);
      curDate.addHours(numHours);
      sumObj = createNewDatasetRecord("", curDate);
    }
    // otherwise add the record values
    _.each(keys, function(key) {
      sumObj[key] += secondResRecord[key];
    })
  });

  // add the final sum object for the last hour
  hoursResRecords.push(sumObj);

  return hoursResRecords;
}

function getStartAndEndDates() {
  var startDate = new Date();
  var endDate = new Date();
  // get the date of the first and last selected item
  // that has value
  // if (g_dataset.length > 0) {
  //  startDate = g_dataset[0].date;
  //  endDate = g_dataset[g_dataset.length -1].date;
  // }

  // all keys are the same for each record
  var keys = _.keys(g_dataset[0]).splice(1); // all keys except the date key
  var findFunction = function (record) {
    var rslt = false;
    _.each(keys, function (key) {
      if (record[key] > 0 && isItemSelected(key)) {
        rslt = true;
      }
    });
    if (rslt) return true;
  };

  // start date search
  var foundStartRec = _.find(g_dataset, findFunction);
  if (foundStartRec) startDate = foundStartRec.date;
  // end date search
  var foundEndRec =  _.find(_.reverse(g_dataset), findFunction);
  if (foundEndRec) endDate = foundEndRec.date;
  // return the dataset to correct order
  _.reverse(g_dataset);
  return {
    start: startDate,
    end: endDate,
  };
}

function readInDataItem(itemName, onNewDataCallback, optElementId = undefined){
  if (optElementId) startSpinner(optElementId);
  if (getItemLoadStatus(itemName) > 0) return;
  setItemLoadStatus(itemName, 1); // loading
  d3.csv(`compressedData/${itemName}.csv`).then(function (fileData){
    _.each(fileData, function(row) {
      // "12/1/2012 00:00:03;2;3"
      var str1 = row[_.keys(row)[0]].split(";");
      if (!fileDataSet[str1[0]]) {
        fileDataSet[str1[0]] = createNewDatasetRecord(str1[0]);
      }
      fileDataSet[str1[0]][itemName] = parseInt(str1[2]);
    });
    // [ {date: Alarmclock:#, CoffeeMaker:# ... key3: , key4 ...} ]
    g_dataset = _.values(fileDataSet);
    setItemLoadStatus(itemName, 2); // loaded
    onNewDataCallback(itemName);
  });
}

function setAsUnselected(itemName, onUnselectedCallback) {
  // TODO remove the data from the dataset
  onUnselectedCallback(itemName);
}

function createNewDatasetRecord(dateStr, optDate = null) {
  var startVal = 0;
  // return a record object having a default value for each item
  // in the items list
  var record = {date: optDate ? new Date(optDate.getTime()) : getDateObj(dateStr)};
  _.each(g_itemList, function (item) {
    record[item.filename] = startVal;
  });
  return record;
}

/* date is unique
Data is ordered
[
 oldest 2011 {date: javascript date obj ,a:10, b:#},
  {....},
 newest 2012 {....}
]
*/