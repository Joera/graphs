let ChartStackedBars = function ChartStackedBars(config,svg,functions) {

    let dataArray;

    svg.defs = svg.layers.data.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect");

    let draw = function draw(data,stackedData,colours) {

        dataArray = data;
        console.log(stackedData);

        // series corresponds to provenance - the columns in the csv table//
        svg.series = svg.layers.data.selectAll(".stackGroup")
            .data(stackedData);

        svg.series.exit().remove();

        svg.seriesEnter = svg.series
            .enter()
            .append("g")
            .attr("class", (d,i) => {
                return "stackGroup " + colours[i];
            });

        svg.bar = svg.seriesEnter.selectAll("rect")
            .data(function(d) { return d; });

        svg.bar.exit().remove();

        svg.barEnter = svg.bar
            .enter()
            .append("rect")
            .attr("class", "bar")
            ;

        svg.barLabels = svg.seriesEnter.selectAll(".barLabel")
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

        svg.dateLabels = svg.seriesEnter.selectAll(".dateLabel")
            .data(function(d) { return d; });

        svg.dateLabelsEnter = svg.dateLabels
            .enter()
            .append('text')
            .attr('class','dateLabel small-label')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '22px')
            .style("text-anchor", "middle")

        ;

    }

    let redraw = function redraw(dimensions,xScale,yScale) {

        let barWidth = 60; // scales.xBand.bandwidth() ||
        let yOffset;
        let xOffset;

        svg.defs
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);

        svg.series = svg.series
            .merge(svg.seriesEnter);

        svg.barMerged = svg.barEnter
            .merge(svg.bar)
            .attr("y", function(d) { return dimensions.height; })
            .attr("x", function(d) {
                if(config.xScale === 'time') {
                    return xScale.xTime(new Date(d.data[config.xParameter]));
                } else {
                    return xScale.xBand(d.data[config.xParameter]);
                }
            })
            .attr("width", function(d) {
                if(config.xScale === 'time') {
                    return dimensions.width / dataArray.length;
                } else {
                    return barWidth; //scales.xBand.bandwidth();
                }
            })
            .attr("clip-path", "url(#clip)")
            .transition()
            .duration(500)
            .attr("y", function(d) { return yScale.stacked(d[1]); })
            .attr("height", function(d) {
                console.log(d); return yScale.stacked(d[0]) - yScale.stacked(d[1]);
            })
           ;

        svg.barLabels
            .merge(svg.barLabelsEnter)
            .text(function(d) {

                return thousands(d[1] - d[0]);
            })
            .attr('transform', function(d) {

                xOffset = dimensions.width / (2 * dataArray.length);
                let start = (d[0] < config.minValue) ? config.minValue : d[0];
                yOffset = ((yScale.stacked(d[1]) - yScale.stacked(start)) / 2) - 11;

                return 'translate(' + (xScale.xBand(d.data[config.xParameter]) + ( barWidth / 2)) + ',' +
                    (yScale.stacked(d[1]) - yOffset)
                    + ')';
            })
            .attr('fill-opacity', 0)
            .transition()
            .delay(500)
            .duration(500)
            .attr('fill-opacity', 1);

        svg.dateLabels
            .merge(svg.dateLabelsEnter)
            .text(function(d) {

                return new Date(d.data['_date']).toLocaleDateString('nl-NL',{ month: 'long', day: 'numeric'});
            })
            .attr('transform', function(d) {

                return 'translate(' + (xScale.xBand(d.data[config.xParameter]) + (barWidth / 2))  + ',' +
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


