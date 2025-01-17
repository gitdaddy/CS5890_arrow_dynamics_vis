"use strict";

// contains the indexes into the
// g_dataset array
// { 11/2/2012: 2}
let fileDataSet = {};

// global dataset of records ordered by date of recording
// [ {date: Alarmclock:, CoffeeMaker: ... key3: , key4 ...} ]
let g_dataset = [];

let areaChartId = "area-chart";

Date.prototype.addHours = function(h){
  this.setHours(this.getHours()+h);
  return this;
};

Date.prototype.addMinutes = function(m){
  this.setMinutes(this.getMinutes()+m);
  return this;
};

function loadSelectedItems() {
  if (getSelectedKeys().length === 0) {
    // nothing is selected
    hideViews();
    return;
  }
  legendShowLoading();
  // only load the selected items on close
  var keys = _.map(g_itemList, item => {
    if (item.loadStatus === 0 && item.selected) {
      return item.filename;
    }
  });
  keys = _.compact(keys);
  if (keys.length === 0) {
    onUpdate();
    return;
  }
  // only call update once all the data
  // is loaded
  readInDataItem(keys, onUpdate); //, areaChartId);
}

function getSelectedKeys() {
  var rslt = _.map(g_itemList, item => {
    if (item.selected) return item.filename
  });
  return _.compact(rslt);
}

function getDateObj(str) {
  if (str === "") return null;
  var dateStr = str.split(" ");
  var dateArray = dateStr[0].split("/");
  if (!dateStr[1]) {
    return null;
  }
  var timeArray = dateStr[1].split(":");
  // new Date(year, month, day, hours, minutes, seconds, milliseconds);
  return new Date(
    parseInt(dateArray[2]),
    parseInt(parseInt(dateArray[1]) - 1), // months are 0 based here
    parseInt(dateArray[0]),
    parseInt(timeArray[0]),
    parseInt(timeArray[1]),
    parseInt(timeArray[2]));
}

function getDataWithDayResolution(){
  var keys = getSelectedKeys();
  return getDataWithHourResolution(keys, g_dataset, 24);
}

// returns the data vales array
// with hour sum intervals
function getDataWithHourResolution(keys, valuesArray, numHours = 1, optStartDate = null, optEndDate = null) {
  if (valuesArray.length === 0) return [];

  var curDate = new Date(valuesArray[0].date.getTime());
  var curIdx = 0;
  var stopIdx = valuesArray.length - 1;
  if (optStartDate && optEndDate) {
    if (optStartDate > valuesArray[valuesArray.length-1].date) return [];
    if (optEndDate < valuesArray[0].date) return [];
    // get start idx
    while (valuesArray[curIdx].date < optStartDate) {
      curIdx++;
    }
    curDate = new Date(valuesArray[curIdx].date.getTime());

    while (valuesArray[stopIdx].date > optEndDate) {
      stopIdx--;
    }
  }

  var hoursResRecords = [];
  curDate.addHours(numHours);
  var sumObj = createNewDatasetRecord("", curDate);
  for(var i = curIdx; i < stopIdx; i++) {
    if (valuesArray[i].date > curDate) {
      // update hour record
      hoursResRecords.push(sumObj);
      curDate.addHours(numHours);
      sumObj = createNewDatasetRecord("", curDate);
    }
    // otherwise add the record values
    _.each(keys, function(key) {
      if(_.isNaN(valuesArray[i][key])) {
        throw "NaN value discovered!!";
      }
      sumObj[key] += valuesArray[i][key];
    });
  }
  // add the final sum object for the last hour
  hoursResRecords.push(sumObj);
  return hoursResRecords;
}

function getDataWithSecondResolution(valuesArray, optStartDate = null, optEndDate = null) {
  if (valuesArray.length === 0) return [];
  var curIdx = 0;
  var stopIdx = valuesArray.length - 1;
  if (optStartDate && optEndDate) {
    if (optStartDate > valuesArray[valuesArray.length-1].date) return [];
    if (optEndDate < valuesArray[0].date) return [];
    // get start idx
    while (valuesArray[curIdx].date < optStartDate) {
      curIdx++;
    }

    while (valuesArray[stopIdx].date > optEndDate) {
      stopIdx--;
    }
  }
  // no need to sum the objects
  // seconds is our highest resolution
  var rslt = [];
  for (var i = curIdx; i < stopIdx; i++){
    rslt.push(valuesArray[i]);
  }
  return rslt;
}

function getStartAndEndDates() {
  var startDate = new Date();
  var endDate = new Date();
  // get the date of the first and last selected item
  // that has value

  // all keys are the same for each record
  var keys = getSelectedKeys();
  if (keys.length === 0) return;
  var findFunction = function (record) {
    var rslt = false;
    _.each(keys, function (key) {
      if (record[key] > 0) {
        rslt = true;
      }
    });
    if (rslt) return true;
  };

  // start date search
  var foundStartRec = _.find(g_dataset, findFunction);
  if (foundStartRec) startDate = foundStartRec.date;
  // end date search
  var foundEndRec;
  for (var i = g_dataset.length-1; i > -1; i--) {
    if (findFunction(g_dataset[i])) {
      foundEndRec = g_dataset[i];
      break;
    }
  }
  if (foundEndRec) endDate = foundEndRec.date;
  return {
    start: startDate,
    end: endDate,
  };
}

function readInDataItem(items, onNewDataCallback, optElementId = undefined){
  var count = 1;
  _.each(items, itemName => {
    if (getItemLoadStatus(itemName) > 0){
      count++;
    } else {
      setItemLoadStatus(itemName, 1); // loading
      d3.csv(`compressedData/${itemName}.csv`).then(function (fileData){
        _.each(fileData, function(row) {
          // "12/1/2012 00:00:03;2;3"
          var valStr = row[_.keys(row)[0]];
          if (valStr !== "") {
            var str1 = valStr.split(";");
            if (str1[0] && str1[0] !== " ") {
              var optIdx = fileDataSet[str1[0]];
              if (!optIdx) {
                var optRecord = createNewDatasetRecord(str1[0]);
                if (optRecord) {
                  g_dataset.push(optRecord);
                  optIdx = g_dataset.length-1;
                  fileDataSet[str1[0]] = g_dataset.length-1;
                }
              }
              if (optIdx) {
                g_dataset[optIdx][itemName] = parseInt(str1[2]);
              }
            }
          }
        });
        setItemLoadStatus(itemName, 2); // loaded
        if (count === items.length) {
          // all items are done loading
          
          /* date is unique
          Data is ordered by the date
          [
          oldest 2011 {date: javascript date obj ,a:10, b:#},
            {....},
          newest 2012 {....}
          ]
          */
          g_dataset = _.sortBy(g_dataset, "date");
          onNewDataCallback();
        }
        count++;
      });
    }
  });
}

// [ {date:123, Alarmclock:#, CoffeeMaker:# ... key3: , key4 ...}, ... ]
function createNewDatasetRecord(dateStr, optDate = null) {
  var startVal = 0;
  // return a record object having a default value for each item
  // in the items list
  var date = optDate ? new Date(optDate.getTime()) : getDateObj(dateStr);
  if (!date) return null;
  var record = {date: date};
  _.each(g_itemList, function (item) {
    record[item.filename] = startVal;
  });
  return record;
}
