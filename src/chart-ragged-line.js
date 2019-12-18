let ChartRaggedLine = function ChartRaggedLine(config,svg,property) {

    //
    let popup = function popup(d) {

        return moment(d[config.xParameter]).subtract(1, 'week').format('D/MM') + ' - '
            + moment(d[config.xParameter]).format('D/MM') + '<br/>'
            + d[property] + '<br/>'

    }

    let draw = function draw(data) {


        svg.average = svg.layers.data.append("path")
            .data([data])
            .attr("class", "average");

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

        // functions.average = d3.line()
        //     .x(function(d) { return xScale.time(new Date(d[config.xParameter])); })
        //     .y(function(d) { return yScale.linear(600) }) // data.map( (w) => { return w[property] }) })
        //     .curve(d3.curveCardinal);

        svg.line
            .attr("d", functions.line)
            .attr("fill", 'transparent')
            .attr("stroke", orange)
            .attr("stroke-width", 4)
        ;

        svg.average
            .attr("x1", xScale.time(new Date(data[data.length - 1][config.xParameter])))
            .attr("x2", xScale.time(new Date(data[0][config.xParameter])))
            .attr("y1", function(d) { return yScale.linear(600) })
            .attr("y2", function(d) { return yScale.linear(600) })
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", 2)

        ;


        svg.circles
            .merge(svg.circlesEnter)
            .attr("cx", function(d,i) {

                return xScale[config.xScaleType](new Date(d[config.xParameter]));
            })
            .attr("cy", function(d) {
                return yScale[config.yScaleType](d[property]);
            })
            .attr("r", 1)
            .attr("fill", 'white')
            .attr("stroke", orange)
            .attr("stroke-width", 4)
            .transition()
            .duration(500)
            .attr("r", 4);


        svg.circles
            .merge(svg.circlesEnter)
            .on("mouseover", function(d) {

                svg.tooltip
                    .html(popup(d))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px")
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
    }

    return {
        draw: draw,
        redraw: redraw
    }
}
