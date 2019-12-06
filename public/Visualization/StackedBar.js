// file for drawing d3 managed svgs

// globals
// use same margin values as in araChart
// use same color palette as the areaChart

let stackedBarData = [];

let total = 0;

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
    total = 0;
    _.each(getSelectedKeys(), function (d) {
        for(let i in g_itemList){
            if(d === g_itemList[i].filename){
                let appliance = {};
                appliance.name = g_itemList[i].filename;
                appliance.sum = sumOfGivenItem(g_itemList[i].filename, startDate, endDate);
                appliance.relativeTotal = total;
                total += appliance.sum;
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
            return scaleBar(d.relativeTotal) + chartMargin.left;
        })
        .attr('y', '10')
        .attr('width', function (d,i) {
            return scaleBar(d.sum);
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

function scaleBar(value){
    return value/total *(chartWidth + chartMargin.left + chartMargin.right + 20);
}
