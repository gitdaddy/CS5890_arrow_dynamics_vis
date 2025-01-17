"using strict";

/** APP Settings
 * Stored/cached locally
 */

// default settings
let g_settings = {
  ea_seqHelpers: 
  {
    label: "Show setup tool-tips",
    value: true,
    totalSequenceHelpers: 2,
    curHelpSequence: 0
  }
}

function updateHelpSequence(completedIdx) {
  var c = g_settings.ea_seqHelpers.curHelpSequence;
  var t = g_settings.ea_seqHelpers.totalSequenceHelpers;
  // no going back
  if (c > completedIdx || completedIdx >= t) return;

  var seqStr = "tt_seq_";
  for (i = 0; i <= completedIdx; i++) {
    var s1 = seqStr + i.toString();
    document.getElementById(s1).style.visibility = "hidden";
  }
  
  var n = completedIdx + 1;
  g_settings.ea_seqHelpers.curHelpSequence = n;

  storeLocalSettings(g_settings);

  if (n === t) return;
  // make the next sequence visible
  var s2 = seqStr + n.toString();
  document.getElementById(s2).style.visibility = "visible";
}

function getLocalSettings() {
  if (localStorage.settings)
    return JSON.parse(localStorage.settings)
}

function storeLocalSettings(settings) {
  localStorage.settings = JSON.stringify(settings);
}

/* Page layout*/
function isItemSelected(filename) {
  var item = _.find(g_itemList, function (i) {
    return i.filename === filename;
  });
  return item.selected;
}

function onUpdate() {
  // when new data is selected
  drawCalender();
  drawLegend();
}

function hideViews() {
  drawLegend();
  d3.select('div#slider-time').style("visibility", "hidden");
  d3.select('#area-chart').style("visibility", "hidden");
  d3.select('#stacked-bar-total').style("visibility", "hidden");
  d3.select('#stacked-bar').style("visibility", "hidden");
  d3.select('#calendar').style("visibility", "hidden");
}

function onItemChecked(item){
  setItemSelectStatus(item.value, item.checked);
  removeStackedBar();
  removeTotalStackedBar();
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
  var s = getLocalSettings();
  if (s) {
    _.assign(g_settings, s);
  }

  // set the helper sequence according to user history
  var seqStr = "tt_seq_";
  var t = g_settings.ea_seqHelpers.totalSequenceHelpers;
  var c = g_settings.ea_seqHelpers.curHelpSequence;
  if (t !== c) {
    var s = seqStr + c.toString();
    document.getElementById(s).style.visibility = "visible";
  }

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

  d3.select('#stacked-bar-total').style("visibility", "hidden");
  d3.select('#stacked-bar').style("visibility", "hidden");
  d3.select('#loading-text').style("visibility", "hidden");

  drawAreaChartInit();
  calendarInit();
  var selectedKeys = getSelectedKeys();
  if (selectedKeys && selectedKeys.length > 0){
    loadSelectedItems();
  }
}


