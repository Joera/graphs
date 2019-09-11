let ChartBarsIncrease = function ChartBarsIncrease(config,svg,functions) {
    

    let draw = function draw(data,colours) {

        svg.bar = svg.layers.data.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            ;

        svg.barLabels = svg.layers.data.selectAll(".barLabel")
            .data(data)
            .enter()
            .append('text')
            .attr('class','barLabel small-label white')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "middle")

        ;

        svg.dateLabels = svg.layers.data.selectAll(".dateLabel")
            .data(data)
            .enter()
            .append('text')
            .attr('class','dateLabel small-label')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '22px')
            .style("text-anchor", "middle")

        ;

    }

    let redraw = function redraw(dimensions,scales) {

        let barWidth = 60; // scales.xBand.bandwidth() ||
        let yOffset;
        let xOffset;

        console.log(scales.xBand.bandwidth());

        svg.layers.data.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);

        svg.bar
            .merge(svg.bar)
            .attr("y", function(d) { console.log(d); return scales.yLinear(d[config.yParameter]); })
            .attr("height", function(d) {

                return dimensions.height - scales.yLinear(d[config.yParameter]);
            })
            .attr("x", function(d) {

                return scales.xBand(d[config.xParameter]);
            })
            .attr("width", function(d) {

                return barWidth;
            })
            .attr("clip-path", "url(#clip)")
           ;

        svg.bar.exit().remove();

        svg.barLabels
            .merge(svg.barLabels)
            .text(function(d) {

                return thousands(d[1] - d[0]);
            })
            .attr('transform', function(d) {

                xOffset = dimensions.width / (2 * data.length);
                let start = (d[0] < config.minValue) ? config.minValue : d[0];
                yOffset = ((scales.yLinear(d[config.yParameter]) - scales.yLinear(start)) / 2) - 11;

                if (config.xScale === 'time') {

                    return 'translate(' + (scales.xTime(new Date(d.data[config.xParameter])) + xOffset)  + ',' +
                        (scales.yLinear(d[config.yParameter]) - yOffset)
                        + ')';

                } else {

                    return 'translate(' + (scales.xBand(d.data[config.xParameter]) + ( barWidth / 2)) + ',' +
                        (scales.yLinear(d[config.yParameter]) - yOffset)
                        + ')';
                }
            })
            .attr('fill-opacity', 0)
            .transition()
            .delay(500)
            .duration(500)
            .attr('fill-opacity', 1);



            svg.dateLabels
                .merge(svg.dateLabels)
                .text(function(d) {

                    return new Date(d['_date']).toLocaleDateString('nl-NL',{ month: 'long', day: 'numeric'});
                })
                .attr('transform', function(d) {

                        xOffset = barWidth / 2;

                        return 'translate(' + (scales.xBand(d[config.xParameter]) + xOffset)  + ',' +
                            dimensions.height
                            + ')';
                })
                .attr('fill-opacity', 0)
                .transition()
                .delay(500)
                .duration(500)
                .attr('fill-opacity', 1);



        //
        // svg.connection
        //     .attr("d", area);

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


