let ChartLine = function ChartLine(config,svg) {

    let draw = function draw(data) {

        svg.line = svg.layers.data.append("path")
            .data([data])
            .attr("class", "line");

        svg.candles = svg.layers.data.selectAll('.candle')
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "candle")
            .style("fill", "orange");
    }

    let redraw = function redraw(scales,functions) {

        functions.line = d3.line()
            .x(function(d) { return scales.xTime(new Date(d[config.xParameter])); })
            .y(function(d) { return scales.yLinear(d[config.yParameter]); })
            .curve(d3.curveCardinal);

        svg.line
            .attr("d", functions.line);

        svg.candles
            .attr('x',(d) => { return scales.xTime(new Date(d[config.xParameter])); })
            .attr('y',(d) => { return scales.yLinear(d[config.yParameter]); })
            .attr('width',10)
            .attr('height', (d,i) => { return d.increase } )

        ;
    }

    return {
        draw: draw,
        redraw: redraw
    }
}
