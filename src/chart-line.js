let ChartLine = function ChartLine(config,svg,dimensions) {


    let popup = function popup(d) {

        return moment(d[config.xParameter]).subtract(1, 'week').format('D/MM') + ' - '
            + moment(d[config.xParameter]).format('D/MM') + '<br/>'
            + d['nieuwe_schademeldingen'] + ' Nieuwe schademeldingen' + '<br/>'
            + d['nieuwe_afgehandeld'] + ' Deze week afgehandeld';
    }

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

    let redraw = function redraw(xScale,yScale,functions,dimensions,data) {


        let candleWidth = (window.innerWidth > 640) ? ((dimensions.width / data.length) - 4) : ((dimensions.width / data.length) - 1);

        functions.line = d3.line()
            .x(function(d) { return xScale.time(new Date(d[config.xParameter])); })
            .y(function(d) { return yScale.linear(d[config.yParameter]); })
            .curve(d3.curveCardinal);

        svg.line
            .attr("d", functions.line);

        svg.candlesUp
            .attr('x',(d) => { return xScale.time(new Date(d[config.xParameter])); })
            .attr('y',(d) => { return yScale.linear(d[config.yParameter]) - (yScale.linear(0) - yScale.linear(d['nieuwe_schademeldingen'])) })
            .attr('width',candleWidth)
            .attr('height', (d) => { return yScale.linear(0) - yScale.linear(d['nieuwe_schademeldingen'])  } )
            .on("mouseover", function(d) {

                svg.tooltip
                    .html(popup(d))
                    .style("left", (d3.event.pageX - 205) + "px")
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
            .attr('x',(d) => { return xScale.time(new Date(d[config.xParameter])); })
            .attr('y',(d) => { return yScale.linear(d[config.yParameter]); })
            .attr('width',candleWidth)
            .attr('height', (d) => { return yScale.linear(0) - yScale.linear(d['nieuwe_afgehandeld'])  } )
            .on("mouseover", function(d) {

                svg.tooltip
                    .html(popup(d))
                    .style("left", (d3.event.pageX - 205) + "px")
                    .style("top", (d3.event.pageY - 5) + "px")
                    // .style('width', '400px')
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
