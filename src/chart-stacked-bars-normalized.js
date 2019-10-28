let ChartStackedBarsNormalized = function ChartStackedBarsNormalized(config,svg,functions) {

    let dataArray;

    svg.defs = svg.layers.data.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect");

    let draw = function draw(data,stackedData,colours) {

        dataArray = data;

        // series corresponds to provenance - the columns in the csv table//
        svg.series = svg.layers.data.selectAll(".stackGroup")
            .data(stackedData);

        svg.series.exit().remove();

        svg.seriesEnter = svg.series
            .enter()
            .append("g");



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

        // if(config.dateLabels) {
        //
            svg.dateLabels = svg.layers.axes.selectAll(".dateLabel")
                .data(stackedData);

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
        //
        // }

        // svg.seriesLabel = svg.seriesEnter.merge(svg.series)
        //     .append("text")
        //     .attr("class", "seriesLabel")
        //     .text('hoi');


    }

    let redraw = function redraw(dimensions,xScale,yScale,colours,smallMultiple,notNormalizedData) {

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

                return "stackGroup " + colours[d.key];
            });

        svg.barEnter
            .attr("height", function(d) {
                return dimensions.height
            })

        svg.barMerged = svg.barEnter
            .merge(svg.bar)
            .attr("y", function(d) {
                return yScale.band(d.data[config.xParameter]);
            })
            .attr("height", function(d) {
                    return yScale.band.bandwidth();
            })
            // .attr("clip-path", "url(#clip)")
            .transition()
            .duration(500)
            .attr("x", function(d) { return xScale.stackedNormalized(d[0]); })
            .attr("width", function(d) {
                return xScale.stackedNormalized(d[1]) - xScale.stackedNormalized(d[0]);
            })
           ;

        svg.barLabels
            .merge(svg.barLabelsEnter)
            .text(function(d,i) {

                // hier niet het percentage
                let item = notNormalizedData[i].filter( (j) => {
                    return j.data.status === d.data.status;
                });

              //      console.log(item);
                return ''; // item[i][1] - item[i][0];

            })
            .attr('transform', function(d) {

              //  yOffset = dimensions.height / (2 * dataArray.length);
                let start = (d[1] < config.minValue) ? config.minValue : d[1];
                xOffset = ((xScale.stackedNormalized(d[0]) - xScale.stackedNormalized(start)) / 2);

                return 'translate(' + (xScale.stackedNormalized(d[0]) - xOffset) + ',' + ((yScale.band(d.data[config.xParameter]) + ( yScale.band.bandwidth() / 2)) + 11 ) +')';

            })
            .attr('fill-opacity', 0)
            .transition()
            .delay(500)
            .duration(500)
            .attr('fill-opacity', 1);


        svg.dateLabels
            .merge(svg.dateLabelsEnter)
            .text(function (d,i) {



                if(i < 4) {
                    return d[i].data['status'];
                }

            })
            .attr('transform', function (d,i) {


                if(i < 4) {
                    return 'translate(' + 30 + ',' + (yScale.band(d[i].data['status']) - 30) + ')';
                }
            })
        ;




    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


