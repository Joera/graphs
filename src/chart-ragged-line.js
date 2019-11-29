let ChartRaggedLine = function ChartRaggedLine(config,svg,dimensions) {

    //
    // let popup = function popup(d) {
    //
    //     return moment(d[config.xParameter]).subtract(1, 'week').format('D/MM') + ' - '
    //         + moment(d[config.xParameter]).format('D/MM') + '<br/>'
    //         + d['nieuwe_schademeldingen'] + ' Nieuwe schademeldingen' + '<br/>'
    //         + d['nieuwe_afgehandeld'] + ' Deze week afgehandeld';
    // }

    let draw = function draw(data) {

        svg.line = svg.layers.data.append("path")
            .data([data])
            .attr("class", "line");

    }

    let redraw = function redraw(xScale,yScale,functions,dimensions,data) {

        functions.line = d3.line()
            .x(function(d) { return xScale.time(new Date(d[config.xParameter])); })
            .y(function(d) { return yScale.linear(d[config.yParameter]); })
            .curve(d3.curveCardinal);

        svg.line
            .attr("d", functions.line);

    }

    return {
        draw: draw,
        redraw: redraw
    }
}
