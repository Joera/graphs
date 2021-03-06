let ChartStackedBars = function ChartStackedBars(config,svg,functions) {

    let dataArray;

    svg.defs = svg.layers.data.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect");

    let draw = function draw(data,stackedData) {

        dataArray = data;

        // series corresponds to provenance - the columns in the csv table//
        svg.series = svg.layers.data.selectAll(".stackGroup")
            .data(stackedData);

        svg.series.exit().remove();

        svg.seriesEnter = svg.series
            .enter()
            .append("g")
            .attr("class", "stackGroup")

        svg.bar = svg.seriesEnter.merge(svg.series).selectAll("rect")
            .data(function(d) { return d; });

        svg.bar.exit().remove();

        svg.barEnter = svg.bar
            .enter()
            .append("rect")
            .attr("class", "bar")
            ;

        svg.barLabels = svg.seriesEnter.merge(svg.series).selectAll(".barLabel")
            .data(function(d) { return d; });

        svg.barLabels.exit().remove();

        svg.barLabelsEnter = svg.barLabels.enter()
            .append('text')
            .attr('class','barLabel small-label white')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "middle")

        ;

        if(config.dateLabels) {

            svg.dateLabels = svg.layers.axes.selectAll(".dateLabel")
                .data(data);

            svg.dateLabelsEnter = svg.dateLabels
                .enter()
                .append('text')
                .attr('class', 'dateLabel small-label')
                .attr('x', 0)
                .attr('dx', config.padding.left)
                .attr('dy', '30px')
                .style("text-anchor", "middle")
                .attr('fill-opacity', 0)
                .transition()
                .delay(500)
                .duration(500)
                .attr('fill-opacity', 1);

        }


    }

        let redraw = function redraw(dimensions,xScale,yScale,property,dataMapping,smallMultiple) {

        let barWidth = xScale.band.bandwidth();
        let yOffset;
        let xOffset;

        if(window.innerWidth < 900) {
            barWidth = 48;
        }

        if(smallMultiple) {
            barWidth = 30;
        }

        barWidth = 0;

        svg.defs
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);

        svg.series = svg.seriesEnter
            .merge(svg.series)
            .attr("class", (d,i) => {

                return "stackGroup " + dataMapping.find( (map) => { return map.column === d.key})['colour'];
            });

        svg.barEnter
            .attr("height", function(d) {
                return dimensions.height
            })

        svg.barMerged = svg.barEnter
            .merge(svg.bar)
            .attr("x", function(d) {
                return xScale.band(d.data[config.xParameter]);
            })
            .attr("width", function(d) {
                if(config.xParameter === '_date') {
                    return dimensions.width / dataArray.length + 1;
                } else {
                    return xScale.band.bandwidth();
                }
            })
            .attr("y", function(d) { return config.padding.top; })
            // .attr("clip-path", "url(#clip)")
            .transition()
            .duration(500)
            .attr("y", function(d) { return config.padding.top + yScale[config.yScaleType](d[1]); })
            .attr("height", function(d) {
                return yScale[config.yScaleType](d[0]) - yScale[config.yScaleType](d[1]);
            })
           ;

        svg.barLabels
            .merge(svg.barLabelsEnter)
            // .text(function(d) {
            //     if(thousands(d[1] - d[0]) > 0) {
            //         return thousands(d[1] - d[0]);
            //     }
            // })
            .attr('transform', function(d) {

                xOffset = dimensions.width / (2 * dataArray.length);
                let start = (d[0] < config.minValue) ? config.minValue : d[0];
                yOffset = ((yScale[config.yScaleType](d[1]) - yScale[config.yScaleType](start)) / 2) - 11;

                return 'translate(' + (xScale.band(d.data[config.xParameter]) + ( xScale.band.bandwidth() / 2)) + ',' +
                    (yScale[config.yScaleType](d[1]) + config.padding.top - yOffset)
                    + ')';
            })
            .attr('fill-opacity', 0)
            .transition()
            .delay(500)
            .duration(500)
            .attr('fill-opacity', 1);


        if(config.dateLabels) {

            svg.dateLabels
                .merge(svg.dateLabelsEnter)
                .text(function (d) {

                    // if (window.innerWidth < 900) {
                    return new Date(d['_date']).toLocaleDateString('nl-NL', {month: 'numeric', day: 'numeric'});
                    // } else {
                    //     return new Date(d['_date']).toLocaleDateString('nl-NL', {month: 'long', day: 'numeric'});
                    // }
                })
                .attr('transform', function (d) {

                    let yOffset = smallMultiple ? dimensions.height : dimensions.height;

                    return 'translate(' + (xScale.band(d[config.xParameter])) + ','
                        + yOffset + ')';
                })
            ;
        }

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


