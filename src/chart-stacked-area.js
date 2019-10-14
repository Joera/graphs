let ChartStackedArea = function ChartStackedBars(config,svg,functions) {


    let prevArea = false;

    let init = function draw(stackedData) {

        svg.series = svg.layers.data.selectAll(".stackedGroup")
            .data(stackedData);

        svg.series.exit().remove();

        svg.seriesEnter = svg.series
            .enter().append("g")
            .attr("class", (d) => { return "stackedGroup " + d.key });

    }

    let draw = function draw(stackedData,colours) {

        svg.areas = svg.series.merge(svg.seriesEnter).selectAll(".flow")
            .data(function(d) { return stackedData; });

        svg.areas.exit().remove();

        svg.areasEnter = svg.areas
            .enter()
            .append("path")
            .attr('class', (d,i) => {
                return 'flow '; // + colours[d.key];
            })

        ;

        svg.areaLabels = svg.seriesEnter.merge(svg.series)
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
                }
            })
            .attr('fill-opacity', 1);
    }

    let redraw = function redraw(dimensions,xScale,yScale,colours) {

        let newArea = d3.area()
            .x(function(d) { return xScale.time(new Date(d.data._date)); })
            .y0(function(d) { return yScale.stacked(d[0]); })
            .y1(function(d) { return yScale.stacked(d[0]); });

        let area = d3.area()
             .x(function(d) { return xScale.time(new Date(d.data._date)); })
            .y0(function(d) { return yScale.stacked(d[0]); })
            .y1(function(d) { return yScale.stacked(d[1]); });

        prevArea = area;

        // existing areas
        svg.areas
            // .attr('d', newArea)
            .transition()
            .duration(200)
            .attr('d', area)
            .style('fill', (d) => {
                return colours[d.key];
            });

        // new areas
        svg.areasEnter
            .attr('d', newArea)
            .transition()
            .delay(200)
            .duration(200)
            .attr('d', area)
            .style('fill', (d) => {
                return colours[d.key];
            });

        svg.areaLabels
            .attr('transform', function(d) {

                return 'translate(' + (dimensions.width - 30) + ',' +
                    yScale.stacked(
                        d[d.length - 1][0] + (
                            .5 * (d[d.length - 1][1])
                        )
                    )
                 + ')';
            })
    }




    return  {
        init : init,
        draw : draw,
        redraw : redraw
    }

}
