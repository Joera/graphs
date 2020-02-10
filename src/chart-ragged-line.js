let ChartRaggedLine = function ChartRaggedLine(config,svg,property) {

    //
    let popup = function popup(d) {

        return moment(d[config.xParameter]).subtract(1, 'week').format('D/MM') + ' - '
            + moment(d[config.xParameter]).format('D/MM') + '<br/>'
            + d[property] + '<br/>'

    }

    let draw = function draw(data) {


        svg.layers.data.selectAll('g.average').remove();

        svg.averageGroup = svg.layers.data.append("g")
            .attr("class", "average");

        svg.averageLine = svg.averageGroup.append("line");

        svg.averageNumber = svg.averageGroup.append("text")
            .attr("class","small-label")
            .attr("text-anchor","end")
            .style("fill","black");

        svg.line = svg.layers.data.selectAll('path')
            .data([data]);

        svg.line.exit().remove();

        svg.lineEnter = svg.line
            .enter()
            .append("path")
            .attr("class", "line");

        svg.circles = svg.layers.data.selectAll("circle")
            .data(data);

        svg.circles.exit().remove();

        svg.circlesEnter = svg.circles
            .enter()
            .append("circle")
            .attr("fill", (d) => d.colour)
        ;

        svg.dateLabels = svg.layers.data.selectAll(".dateLabel")
            .data(data);

        svg.dateLabels.exit().remove();

        svg.dateLabelEnter = svg.dateLabels
            .enter()
            .append("text")
            .attr("class", "dateLabel");


    }

    let redraw = function redraw(xScale,yScale,functions,dimensions,data,colour) {

        functions.line = d3.line()
            .x(function(d) { return xScale.time(new Date(d[config.xParameter])); })
            .y(function(d) { return yScale.linear(d[property]); })
            .curve(d3.curveCardinal);

        // functions.average = d3.line()
        //     .x(function(d) { return xScale.time(new Date(d[config.xParameter])); })
        //     .y(function(d) { return yScale.linear(600) }) // data.map( (w) => { return w[property] }) })
        //     .curve(d3.curveCardinal);

        svg.line
            .merge(svg.lineEnter)
            .attr("d", functions.line)
            .attr("fill", 'transparent')
            .attr("stroke", colour)
            .attr("stroke-width", 4)
        ;

        let av = (data.reduce((a,b) => a + parseInt(b[property]),0)) / data.length;


        svg.averageGroup
            .attr("transform", (d) => {
                return "translate(" + 0 + ", " + yScale.linear(av) + ")"
            });

        svg.averageLine
            .attr("x1", xScale.time(new Date(data[data.length - 1][config.xParameter])) - 20)
            .attr("x2", xScale.time(new Date(data[0][config.xParameter])) + 20)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("fill", "none")
            .style("stroke", "gray")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "2 4")
        ;

        svg.averageNumber
            .attr("dx", dimensions.width + 36)
            .attr("dy", 4)
            .text("gem: " + Math.round(av));

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
            .attr("stroke", colour)
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

        svg.dateLabels
            .merge(svg.dateLabelEnter)
            .attr("x", function(d,i) {

                return xScale[config.xScaleType](new Date(d[config.xParameter]));
            })
            .attr("y", function(d) {
                return yScale[config.yScaleType](d[property]);
            })
            .attr("dx", dimensions.width + 36)
            .attr("dy", 4)
            .text( function() {
                return moment(d[config.xParameter]).format('D/MM')
            });

    }

    return {
        draw: draw,
        redraw: redraw
    }
}
