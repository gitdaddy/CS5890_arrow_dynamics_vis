"use strict";

/*
# python 2
python -m SimpleHTTPServer
# python 3
python -m http.server
*/

let fileDataSet = {};

let colorSet = ["#5d8aa8", "#f0f8ff","#e32636", "#efdecd","#e52b50", "#ffbf00","#ff033e", "#9966cc","#a4c639"
  , "#cd9575","#915c83", "#008000","#00ffff", "#a52a2a","#fdee00", "#007fff","#0000ff", "#1dacd6"
  ,"#800020", "#480607","#36454f", "#7fff00","#ffa700", "#002e63","#013220", "#1a2421"];

// global dataset of records ordered by date of recording
// [ {date: Alarmclock:, CoffeeMaker: ... key3: , key4 ...} ]
let g_dataset = [];

// const allKeys = _.map(g_itemList, item => {return item.filename});

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
  // only load the selected items on close
  var anySelected = false;
  _.each(getSelectedKeys(), function (key) {
      anySelected = true;
      readInDataItem(key, onUpdate); //, areaChartId);
  });
  if (!anySelected) onUpdate();
}

function getSelectedKeys() {
  var rslt = _.map(g_itemList, item => {
    if (item.selected) return item.filename
  });
  return _.compact(rslt);
}

function getDateObj(str) {
  if (str === "") return new Date();
  var dateStr = str.split(" ");
  if (!dateStr[0] || !dateStr[1]) {
    // throw "Invalid date";
    console.log("date str empty");
    return new Date();
  }
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

// yes some of this could in its own function to reduce duplicate code
// but I don't have time
// function getDataWithMinuteResolution(keys, valuesArray, numMinutes = 1, optStartDate = null, optEndDate = null) {
//   if (valuesArray.length === 0) return [];
//   var curDate = new Date(valuesArray[0].date.getTime());
//   var curIdx = 0;
//   var stopIdx = valuesArray.length - 1;
//   if (optStartDate && optEndDate) {
//     if (optStartDate > valuesArray[valuesArray.length-1].date) return [];
//     if (optEndDate < valuesArray[0].date) return [];
//     // get start idx
//     while (valuesArray[curIdx].date < optStartDate) {
//       curIdx++;
//     }
//     curDate = new Date(valuesArray[curIdx].date.getTime());

//     while (valuesArray[stopIdx].date > optEndDate) {
//       stopIdx--;
//     }
//   }

//   var minRecord = [];
//   curDate.addMinutes(numMinutes);
//   var sumObj = createNewDatasetRecord("", curDate);
//   for(var i = curIdx; i < stopIdx; i++) {
//     if (valuesArray[i].date > curDate) {
//       // update hour record
//       minRecord.push(sumObj);
//       curDate.addMinutes(numMinutes);
//       sumObj = createNewDatasetRecord("", curDate);
//     }
//     // otherwise add the record values
//     _.each(keys, function(key) {
//       if(_.isNaN(valuesArray[i][key])) {
//         throw "NaN value discovered!!";
//       }
//       sumObj[key] += valuesArray[i][key];
//     });
//   }
//   // add the final sum object for the last hour
//   minRecord.push(sumObj);
//   return minRecord;
// }

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

function readInDataItem(itemName, onNewDataCallback, optElementId = undefined){
  // if (optElementId) startSpinner(optElementId);
  if (getItemLoadStatus(itemName) > 0){
    onNewDataCallback(itemName);
    return;
  } 
  setItemLoadStatus(itemName, 1); // loading
  d3.csv(`compressedData/${itemName}.csv`).then(function (fileData){
    _.each(fileData, function(row) {
      // "12/1/2012 00:00:03;2;3"
      var valStr = row[_.keys(row)[0]];
      if (valStr !== "") {
        var str1 = valStr.split(";");
        if (str1[0] && str1[0] !== " ") {
          if (!fileDataSet[str1[0]]) {
            fileDataSet[str1[0]] = createNewDatasetRecord(str1[0]);
          }
          fileDataSet[str1[0]][itemName] = parseInt(str1[2]);
        }
      }
    });
    // [ {date: Alarmclock:#, CoffeeMaker:# ... key3: , key4 ...} ]
    g_dataset = _.sortBy(_.values(fileDataSet), "date");
    setItemLoadStatus(itemName, 2); // loaded
    // stopSpinner();
    onNewDataCallback(itemName);
  });
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