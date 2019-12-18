let ChartRaggedLine = function ChartRaggedLine(config,svg,property) {

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


        svg.circles = svg.layers.data.selectAll("circle")
            .data(data);

        svg.circles.exit().remove();

        svg.circlesEnter = svg.circles
            .enter()
            .append("circle")
            .attr("fill", (d) => d.colour)
        ;

    }

    let redraw = function redraw(xScale,yScale,functions,dimensions,data) {

        functions.line = d3.line()
            .x(function(d) { return xScale.time(new Date(d[config.xParameter])); })
            .y(function(d) { return yScale.linear(d[property]); })
            .curve(d3.curveCardinal);

        svg.line
            .attr("d", functions.line)
            .attr("fill", 'transparent')
            .attr("stroke", orange)
            .attr("stroke-width", 4)
        ;

        svg.circles
            .merge(svg.circlesEnter)

            .attr("cx", function(d,i) {

                return xScale[config.xScaleType](new Date(d[config.xParameter]));
            })

            .attr("r", 1)
            .attr("fill",orange)
            .transition()
            .duration(500)
            .attr("r", 4)
            .attr("cy", function(d) {
                return yScale[config.yScaleType](d[property]);
            })
        ;
    }

    return {
        draw: draw,
        redraw: redraw
    }
}
