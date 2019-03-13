let ChartStackedArea = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(stackedData) {

        svg.series = svg.layers.data.selectAll(".serie")
            .data(stackedData)
            .enter().append("g")
            .attr("class", (d) => { return "serie " + d.key });
        // .attr("fill", function(d) { return z(d.key); })

        svg.areas = svg.series
            .append("path")
            // .attr("fill", "#ccc")
            .attr('class', 'flow');

        svg.areaLabels = svg.series
            .append('text')
            .datum(function(d) { return d; })
            .attr('x', 0)
            .attr('dy', 0)
            .style("text-anchor", "start")
            .text(function(d) { return d.key; })
            .attr('fill-opacity', 1);




    }

    let redraw = function redraw(dimensions,scales) {

        let area = d3.area()
            .x(function(d) {
                return scales.xTime(new Date(d.data.date)); })
            .y0(function(d) { return scales.yLinear(d[0]); })
            .y1(function(d) { return scales.yLinear(d[1]); });

        svg.areas
            .attr('d', area);


        svg.areaLabels
            .attr('transform', function(d) { console.log(d); return 'translate(' + dimensions.width + ',' + scales.yLinear(d[d.length -1][0] + (scales.yLinear(d[d.length -1][1] - scales.yLinear(d[d.length -1][0] / 2)) + ')'; })
    }




    return  {
        draw : draw,
        redraw : redraw
    }

}
