let ChartLine = function ChartLine(config,svg) {

    let draw = function draw(data) {

        svg.line = svg.layers.data.append("path")
            .data([data])
            .attr("class", "line");

        svg.candlesUp = svg.layers.data.selectAll('.candle up')
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "candle up")
            .style("fill", "#777c00");

        svg.candlesDown = svg.layers.data.selectAll('.candle down')
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "candle down")
            .style("fill", "#65A7C5");
    }

    let redraw = function redraw(scales,functions) {

        functions.line = d3.line()
            .x(function(d) { return scales.xTime(new Date(d[config.xParameter])); })
            .y(function(d) { return scales.yLinear(d[config.yParameter]); })
            .curve(d3.curveCardinal);

        svg.line
            .attr("d", functions.line);

        svg.candlesUp
            .attr('x',(d) => { return scales.xTime(new Date(d[config.xParameter])); })
            .attr('y',(d) => { return scales.yLinear(d[config.yParameter]) - (scales.yLinear(0) - scales.yLinear(d.increase)) })
            .attr('width',8)
            .attr('height', (d) => { return scales.yLinear(0) - scales.yLinear(d.increase)  } )
            .on("mouseover", function(d) {

                let html = d.increase + ' nieuwe meldingen';

                svg.tooltip
                    .html(html)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 5) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                svg.tooltip.transition()
                    .duration(250)
                    .style("opacity", 0);
            })
        ;

        svg.candlesDown
            .attr('x',(d) => { return scales.xTime(new Date(d[config.xParameter])); })
            .attr('y',(d) => { return scales.yLinear(d[config.yParameter]); })
            .attr('width',8)
            .attr('height', (d) => { return scales.yLinear(0) - scales.yLinear(d.decrease)  } )
            .on("mouseover", function(d) {

                let html = d.decrease + ' nieuwe besluiten';

                svg.tooltip
                    .html(html)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 5) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                svg.tooltip.transition()
                    .duration(250)
                    .style("opacity", 0);
            })
    }

    return {
        draw: draw,
        redraw: redraw
    }
}
