// file for drawing d3 managed svgs

// globals
// use same margin values as in araChart
// use same color palette as the areaChart

let stackedBarData = [];

let total = 0;

function sumOfGivenItem(item, startDate, endDate) {
    let sum = 0;

    _.each(g_dataset, function (d) {
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
    //console.log("stackedbarupdatedata");
    //console.log(g_dataset);
    //console.log("items");
    //console.log(g_itemList);
    stackedBarData = [];
    _.each(g_itemList, function (d) {
        let appliance = {};
        appliance.name = d.filename;
        appliance.sum = sumOfGivenItem(d.filename, startDate, endDate);
        appliance.relativeTotal = total;
        total += appliance.sum;
        stackedBarData.push(appliance);
    });
    //console.log("stackedBarData");
    //console.log(stackedBarData);
}

function drawStackedBar(startDate, endDate){
    updateStackedBarData(startDate, endDate);

    //totalSum();
    console.log(stackedBarData);

    removeStackedBar();

    d3.select("#stackedBarSvg")
        .attr("width", chartWidth + chartMargin.left + chartMargin.right)
        .attr("height", "100")
        .selectAll('rect')
        .data(stackedBarData)
        .enter()
        .append("g")
        .append("rect")
        .attr('x', function (d, i) {
            return scaleBar(d.relativeTotal) + chartMargin.left + 20;
        })
        .attr('y', '10')
        .attr('width', function (d,i) {
            return scaleBar(d.sum);
        })
        .attr('height', "30")
        .attr("fill", function (d,i) {
            return colorSet[i];
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
    console.log("REMOVEING STACKED BAR")
    d3.select("#stackedBarSvg")
        .selectAll('g')
        .remove()
    ;
}

function scaleBar(value){
    return value/total *(chartWidth + chartMargin.left + chartMargin.right);
}
