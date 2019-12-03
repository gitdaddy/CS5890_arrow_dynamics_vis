// file for drawing d3 managed svgs

// globals
// use same margin values as in araChart
// use same color palette as the areaChart

let stackedBarData = [];

function totalSum(){
    let totlSum = 0;
    _.each(stackedBarData, function (d) {
        // if(d.date && startDate && endDate){
        //     if(d.date.getTime() >= startDate.getTime() && d.date.getTime() <= endDate.getTime()){
        //         console.log("OH WOOW TIS TRUE!");
        //         console.log(d.date + " : " + startDate);
        //         console.log(d.date.getTime() + " : " + startDate.getTime());
        //         console.log(d.date + " : " + endDate);
        //         console.log(d.date.getTime() + " : " + endDate.getTime());
        //         throw ("bruh");
        //         sum += d[item];
        //     }
        // }
        sum += d[sum];
    });
}

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
        stackedBarData.push(appliance);
    });
    //console.log("stackedBarData");
    //console.log(stackedBarData);
}

function drawStackedBar(){
    updateStackedBarData();
}
