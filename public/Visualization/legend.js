
function drawLegend() {
  // before drawing reset the
  // previous state
  d3.select("#legendSvg")
  .selectAll('g')
  .remove()
  ;

  let boxes = d3.select("#legendSvg")
        .attr("width", (chartWidth + chartMargin.left + chartMargin.right) *2)
        .attr("height", "40")
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