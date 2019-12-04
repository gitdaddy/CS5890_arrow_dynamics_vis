"using strict";

/* Page layout 
Defines what happens 
when a user interacts with the view

Item helper functions
*/

function isItemSelected(filename) {
  var item = _.find(g_itemList, function (i) {
    return i.filename === filename;
  });
  return item.selected;
}

function onUpdate() {
  // when new data is selected
  drawCalender();
}

function onItemChecked(item){
  //console.log("checked:" + item.value + " - reading in data...");
  setItemSelectStatus(item.value, item.checked);
  removeStackedBar();
}

function setItemSelectStatus(filename, status) {
  var idx = _.findIndex(g_itemList, function (i) {
    return i.filename === filename;
  });
  g_itemList[idx].selected = status;
}

function getItemLoadStatus(filename) {
  var item = _.find(g_itemList, function (i) {
    return i.filename === filename;
  });
  return item.loadStatus;
}

function setItemLoadStatus(filename, status) {
  var idx = _.findIndex(g_itemList, function (i) {
    return i.filename === filename;
  });
  g_itemList[idx].loadStatus = status;
}

function pageInit() {
  // when the page loads
  var itemSelection = d3.select("#mySidebar").selectAll("label").data(g_itemList);
  itemSelection.enter()
    .append("label")
    .html(d => {
      // load a number of sets initially
      if (d.loadOnStart) {
        onItemChecked({checked: true, value: d.filename, label: d.label});
        return `<input type="checkbox" checked value="${d.filename}" onclick="onItemChecked(this)" /> ${d.label}`;
      }
      return `<input type="checkbox" value="${d.filename}" onclick="onItemChecked(this)" /> ${d.label}`;
    })
    ;

  drawAreaChartInit();
  calendarInit();
  var selectedKeys = getSelectedKeys();
  if (selectedKeys && selectedKeys.length > 0)
    loadSelectedItems();
}
