let ChartLine = function ChartLine(config,svg) {

    let draw = function draw(data) {

        svg.line = svg.layers.data.append("path")
            .data([data])
            .attr("class", "line");
    }

    let redraw = function redraw(scales,functions) {

        functions.line = d3.line()
            .x(function(d) { return scales.xTime(new Date(d.date)); })
            .y(function(d) { return scales.yLinear(d[config.yParameter]); });

        svg.line
            .attr("d", functions.line);
    }

    return {
        draw: draw,
        redraw: redraw
    }
}
