// file for drawing d3 managed svgs

// globals
// use same margin values as in araChart
// use same color palette as the areaChart

let stackedBarData = [];

let selectTotal = 0;

function sumOfGivenItem(item, startDate, endDate) {
    let sum = 0;
    let items = [];
    items.push(item);
    _.each(getDataWithHourResolution(items, g_dataset, 24, startDate, endDate), function (d) {
        sum += d[item];
    });
    return sum;
}

function updateStackedBarData(startDate, endDate) {
    let theData = [];
    selectTotal = 0;
    _.each(getSelectedKeys(), function (d) {
        for(let i in g_itemList){
            if(d === g_itemList[i].filename){
                let appliance = {};
                appliance.name = g_itemList[i].filename;
                appliance.sum = sumOfGivenItem(g_itemList[i].filename, startDate, endDate);
                appliance.relativeTotal = selectTotal;
                selectTotal += appliance.sum;
                theData.push(appliance);
            }
        }

    });
    stackedBarData = theData;
}

function drawStackedBar(startDate, endDate){
    d3.select('#stacked-bar').style("visibility", "unset");

    updateStackedBarData(startDate, endDate);

    removeStackedBar();

    d3.select("#stackedBarSvg")
        .attr("width", (chartWidth + chartMargin.left + chartMargin.right) *2)
        .attr("height", "70")
        .selectAll('rect')
        .data(stackedBarData)
        .enter()
        .append("g")
        .append("rect")
        .attr('x', function (d, i) {
            return scaleBar(d.relativeTotal, selectTotal) + chartMargin.left;
        })
        .attr('y', '10')
        .attr('width', function (d,i) {
            return scaleBar(d.sum, selectTotal);
        })
        .attr('height', "30")
        .attr("fill", function (d) {
            return chartColorScale(d.name);
        })
        .attr('value', function (d) {
            return d.name;
        })
        .attr('title', function(d){
            return d.name;
        })
    ;
}

function removeStackedBar() {

    d3.select("#stackedBarSvg")
        .selectAll('g')
        .remove()
    ;
}

function removeTotalStackedBar() {
    d3.select("#totalStackedBarSvg")
        .selectAll('g')
        .remove()
    ;
}

function scaleBar(value, totalVal){
    return value/totalVal *(chartWidth + chartMargin.left + chartMargin.right + 20);
}


//---------------------------------------------------------------------------------------------------------------------

// file for drawing d3 managed svgs

// globals
// use same margin values as in araChart
// use same color palette as the areaChart

let totalStackedBarData = [];

let total = 0;

function sumOfItem(item) {
    let sum = 0;
    _.each(g_dataset, function (d) {
        sum += d[item];
    });
    //console.log("SUM " + item);
    //console.log(sum);
    return sum;
}

function updateTotalStackedBarData() {
    //console.log("stackedbarupdatedata");
    //console.log(g_dataset);
    //console.log("items");
    //console.log(g_itemList);
    total = 0;
    let theData = [];
    _.each(getSelectedKeys(), function (d) {
        for(let i in g_itemList){
            if(d === g_itemList[i].filename){
                let appliance = {};
                appliance.name = g_itemList[i].filename;
                appliance.sum = sumOfItem(g_itemList[i].filename);
                appliance.relativeTotal = total;
                total += appliance.sum;
                theData.push(appliance);
            }
        }

    });
    //console.log("stackedBarData");
    //console.log(stackedBarData);
    totalStackedBarData = theData;
}

function drawTotalStackedBar() {
    d3.select('#stacked-bar-total').style("visibility", "unset");

    updateTotalStackedBarData();

    removeTotalStackedBar();

    console.log(totalStackedBarData);

    d3.select("#totalStackedBarSvg")
        .attr("width", (chartWidth + chartMargin.left + chartMargin.right) * 2)
        .attr("height", "40")
        .selectAll('rect')
        .data(totalStackedBarData)
        .enter()
        .append("g")
        .append("rect")
        .attr('x', function (d, i) {
            return scaleBar(d.relativeTotal, total) + chartMargin.left;
        })
        .attr('y', '10')
        .attr('width', function (d, i) {
            return scaleBar(d.sum, total);
        })
        .attr('height', "30")
        .attr("fill", function (d) {
            return chartColorScale(d.name);
        })
        .attr('value', function (d) {
            return d.name;
        })
        .attr('title', function (d) {
            return d.name;
        })
    ;
}


