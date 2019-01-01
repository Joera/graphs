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
            .style("fill", "orange");

        svg.candlesDown = svg.layers.data.selectAll('.candle down')
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "candle down")
            .style("fill", "#777c00");
    }

    let redraw = function redraw(scales,functions) {

        functions.line = d3.line()
            .x(function(d) { return scales.xTime(new Date(d[config.xParameter])); })
            .y(function(d) { return scales.yLinear(d[config.yParameter]); })
            .curve(d3.curveCardinal);

        svg.line
            .attr("d", functions.line);

        svg.candlesUp
            .attr('x',(d) => { return scales.xTime(new Date(d[config.xParameter])) - 5; })
            .attr('y',(d) => { return scales.yLinear(d[config.yParameter]); })
            .attr('width',10)
            .attr('height', (d) => { return scales.yLinear(d.increase) } )

        ;

        svg.candlesDown
            .attr('x',(d) => { return scales.xTime(new Date(d[config.xParameter])) + 5; })
            .attr('y',(d) => { return scales.yLinear(d[config.yParameter]); })
            .attr('width',10)
            .attr('height', (d) => { return scales.yLinear(d.decrease) } );
    }

    return {
        draw: draw,
        redraw: redraw
    }
}
