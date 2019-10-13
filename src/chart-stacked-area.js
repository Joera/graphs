let ChartStackedArea = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(stackedData,colours) {

        svg.series = svg.layers.data.selectAll(".serie")
            .data(stackedData)
            .enter().append("g")
            .attr("class", (d) => { return "serie " + d.key });
        // .attr("fill", function(d) { return z(d.key); })

        svg.areas = svg.series
            .append("path")
            // .attr("fill", "#ccc")
            .attr('class', (d,i) => {
                return 'flow ' + colours[i];
            });

        svg.areaLabels = svg.series
            .append('text')
            .attr('class','small-label')
            .datum(function(d) { return d; })
            .attr('x', 0)
            .attr('dx', '-10px')
            .attr('dy', '6px')
            .style("text-anchor", "end")
            .text(function(d) {

                if (d.key == 'in_behandeling') {
                    return 'In behandeling';
                } else if (d.key == 'afgehandeld') {
                    return 'Afgehandeld';
                } else {
                    return ''; //d.key;
                }
            })
            .attr('fill-opacity', 1);
    }

    let redraw = function redraw(dimensions,xScale,yScale) {

        let area = d3.area()
             .x(function(d) { return xScale.time(new Date(d.data._date)); })
            .y0(function(d) { return yScale.linear(d[0]); })
            .y1(function(d) { return yScale.linear(d[1]); });

        svg.areas
            .attr('d', area);

        svg.areaLabels
            .attr('transform', function(d) {

                return 'translate(' + (dimensions.width - 30) + ',' +
                    yScale.linear(
                        d[d.length - 1][0] + (
                            .5 * (d[d.length - 1][1])
                        )
                    )
                 + ')';
            })
    }




    return  {
        draw : draw,
        redraw : redraw
    }

}
