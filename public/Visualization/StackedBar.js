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
    _.each(getDataWithHourResolution(items, g_dataset, startDate, endDate), function (d) {
        // if(d.date && startDate && endDate){
        //     if(d.date.getTime() >= startDate.getTime() && d.date.getTime() <= endDate.getTime()){
        //         console.log("OH WOOW TIS TRUE!");
        //         console.log(d.date + " : " + startDate);
        //         console.log(d.date.getTime`() + " : " + startDate.getTime());
        //         console.log(d.date + " : " + endDate);
        //         console.log(d.date.getTime() + " : " + endDate.getTime());
        //         throw ("bruh");
        //         sum += d[item];
        //     }
        // }
        sum += d[item];
    });
    //console.log("SUM " + item);
    //console.log(sum);
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
    updateStackedBarData(startDate, endDate);

    removeStackedBar();

    d3.select("#stackedBarSvg")
        .attr("width", (chartWidth + chartMargin.left + chartMargin.right) *2)
        .attr("height", "100")
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

    let boxes = d3.select("#legendSvg")
        .attr("width", (chartWidth + chartMargin.left + chartMargin.right) *2)
        .attr("height", "50")
        .selectAll('rect')
        .data(getSelectedKeys())
        .enter()
        .append("g");

    boxes.append("rect")
        .attr('x', function (d, i) {
            return i * 180 + chartMargin.left;
        })
        .attr('y', '10')
        .attr('width', '20')
        .attr('height', "20")
        .attr("fill", function (d) {
            return chartColorScale(d);
        })
        .attr('value', function (d) {
            return d;
        });

    boxes.append("text")
        .attr("x", function(d,i) {
            return i * 180 + 75;
        })
        .attr("y", '20')
        .attr("dy", ".55em")
        .text(function(d){return d})
    ;





}

function removeStackedBar() {
    d3.select("#stackedBarSvg")
        .selectAll('g')
        .remove()
    ;

    d3.select("#legendSvg")
        .selectAll('g')
        .remove()
    ;

}

function scaleBar(value){
    return value/total *(chartWidth + chartMargin.left + chartMargin.right + 20);
}
