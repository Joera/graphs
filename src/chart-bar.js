let ChartBar = function ChartBar(config,svg) {

    let draw = function draw(data,colours) {

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data);
        
        svg.bar.exit().remove();

        svg.barEnter = svg.bar
            .enter()
            .append("rect")
            .attr("class", function(d,i) {
                return "bar  " + colours[i]; // + sluggify(d.status) + "
            });

        svg.barLabels = svg.layers.data.selectAll(".barLabel")
            .data(data);

        svg.barLabels.exit().remove();

        svg.barLabelsEnter = svg.barLabels
            .enter()
            .append('text')
            .attr('class','barLabel small-label')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "middle")

            ;
    }

    let redraw = function redraw(dimensions,xScale,yScale) {

        svg.bar
            .merge(svg.barEnter)
            .attr("x", function(d) {

                if (config.xParameter === '_date') {

                    return xScale.time(new Date(d[config.xParameter]));

                } else {

                    return xScale.band(d[config.xParameter]);
                }
            })
            .attr("y", function(d) { return dimensions.height; })
            .attr("height", 0)
            .attr("width", function(d) {

                if (config.xParameter === '_date') {

                    return 60;
                } else {

                    return xScale.band.bandwidth()
                }

            })
            .transition()
            .duration(500)
            .attr("y", function(d) { return config.margin.top + yScale.linear(d[config.yParameter]); })
            .attr("height", function(d) { return dimensions.height - yScale.linear(d[config.yParameter]); })

        ;

        svg.barLabels
            .merge(svg.barLabelsEnter)
            .text(function(d) {

                if(config.currencyLabels) {

                    return convertToCurrency(d.totaal);

                } else {

                    return d.totaal ? d.totaal : '< 25';
                }


            })
            .attr('transform', function(d) {

                if (config.xParameter === '_date') {

                    return 'translate(' + (xScale.time(new Date(d[config.xParameter]))) + 60 + ',' +
                        yScale.linear(d[config.yParameter])
                        + ')';

                } else {

                    return 'translate(' + (xScale.band(d[config.xParameter]) + (xScale.band.bandwidth() / 2)) + ',' +
                        yScale.linear(d[config.yParameter])
                        + ')';
                }
            })
            .attr('fill-opacity', 0)
            .transition()
            .delay(500)
            .duration(500)
            .attr('fill-opacity', 1)
    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


