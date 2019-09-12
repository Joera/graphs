let ChartBarsIncrease = function ChartBarsIncrease(config,svg,functions) {

    let dataArray;

    let draw = function draw(data,colours) {

        dataArray = data;

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data);

        svg.bar.exit().remove();

        svg.barEnter = svg.bar
            .enter()
            .append("rect")
            .attr("class", "bar");

        svg.barLabels = svg.layers.data.selectAll(".barLabel")
            .data(data);

        svg.barLabels.exit().remove();

        svg.barLabelsEnter = svg.barLabels
            .enter()
            .append('text')
            .attr('class','barLabel small-label white')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "middle")

        ;

        svg.difference = svg.layers.data.selectAll(".diff")
            .data(data);

        svg.difference.exit().remove()

        svg.differenceEnter = svg.difference
            .enter().append("rect")
            .attr("class", "diff blue")
        ;

        svg.diffLabels = svg.layers.data.selectAll(".diffLabel")
            .data(data);

        svg.diffLabels.exit().remove();

        svg.diffLabelsEnter = svg.diffLabels
            .enter()
            .append('text')
            .attr('class','diffLabel label blue')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "end")

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

    let redraw = function redraw(dimensions,xScale,yScale,property) {

        let barWidth = 60; // scales.xBand.bandwidth() ||
        let yOffset;
        let xOffset;

        if(window.innerWidth < 900) {
            barWidth = 12;
        }

        let minValue = (d3.max(dataArray, d => d[property]) > 20000) ? config.minValue : 900;

        svg.layers.data.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);

        svg.bar
            .merge(svg.barEnter)
            .attr("x", function(d) {

                return xScale.band(d[config.xParameter]);
            })
            .attr("width", function(d) {

                return barWidth;
            })
            .attr("clip-path", "url(#clip)")
            .attr("y", function(d) { return dimensions.height; })
            .transition()
            .duration(250)
            .attr("y", function(d) { return yScale.linear(d[property]); })
            .attr("height", function(d) {
                return dimensions.height - yScale.linear(d[property]);
            })
            .style("fill", function(d) {
                if(property === 'aos_meldingen') {
                    return darkblue;
                } else {
                    return green;
                }
            });

        svg.barLabels
            .merge(svg.barLabelsEnter)
            .text(function(d) {

                return thousands(d[property]);
            })
            .attr('fill-opacity', 0)
            .attr('transform', function(d) {

                xOffset = dimensions.width / (2 * dataArray.length);

                yOffset = ((yScale.linear(d[property]) - yScale.linear(minValue)) / 2) - 11;

                return 'translate(' + (xScale.band(d[config.xParameter]) + ( barWidth / 2)) + ',' +
                    dimensions.height
                    + ')';
            })
            .transition()
            .delay(500)
            .duration(500)
            .attr('transform', function(d) {

                xOffset = dimensions.width / (2 * dataArray.length);

                yOffset = ((yScale.linear(d[property]) - yScale.linear(minValue)) / 2) - 11;

                return 'translate(' + (xScale.band(d[config.xParameter]) + ( barWidth / 2)) + ',' +
                    (yScale.linear(d[property]) - yOffset)
                    + ')';
            })
            .attr('fill-opacity', 1);



        svg.difference
            .merge(svg.differenceEnter)
            .attr("y", function(d) { return yScale.linear(d[property]); })
            .attr("height",0)
            .attr("x", function(d) {

                return xScale.band(d[config.xParameter]) - 14;
            })
            .attr("width", function(d) {

                return 10;
            })
            .attr("clip-path", "url(#clip)")
            .transition()
            .delay(250)
            .duration(250)
            .attr("height", function(d) {

                return dimensions.height - yScale.linear(d['nieuwe_' + property] + minValue);
            })
        ;


        svg.difference.exit().remove();

        svg.diffLabels
            .merge(svg.diffLabelsEnter)
            .text(function(d) {

                return '+' + thousands(d['nieuwe_' + property]);
            })
            .attr('transform', function(d) {

                yOffset = .5 * (dimensions.height - yScale.linear(d['nieuwe_' + property] + minValue)) + 11;

                return 'translate(' + (xScale.band(d[config.xParameter]) - 20) + ',' +
                    (yScale.linear(d[property]) + yOffset)
                    + ')';
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

                        return 'translate(' + (xScale.band(d[config.xParameter]) + xOffset)  + ',' +
                            dimensions.height
                            + ')';
                })
                .attr('fill-opacity', 0)
                .transition()
                .delay(500)
                .duration(500)
                .attr('fill-opacity', 1);

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


