let ChartStackedArea = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(stackedData,colours) {


        svg.series = svg.layers.data.selectAll(".stackedGroup")
            .data(stackedData);


        svg.series.exit().remove();

        svg.seriesEnter = svg.series
            .enter()
            .enter().append("g")
            .attr("class", (d) => { return "stackedGroup " + d.key });


        svg.areas = svg.seriesEnter.merge(svg.series)
            .append("path")
            .attr('class', (d,i) => {
                return 'flow ' + colours[i];
            });

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
                } else {
                    return ''; //d.key;
                }
            })
            .attr('fill-opacity', 1);
    }

    let redraw = function redraw(dimensions,xScale,yScale) {

        let area = d3.area()
             .x(function(d) { return xScale.time(new Date(d.data._date)); })
            .y0(function(d) { return yScale.stacked(d[0]); })
            .y1(function(d) { return yScale.stacked(d[1]); });

        svg.areas
            .attr('d', area);

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
        draw : draw,
        redraw : redraw
    }

}
