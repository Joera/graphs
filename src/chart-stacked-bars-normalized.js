let ChartStackedBarsNormalized = function ChartStackedBarsNormalized(config,svg,functions) {

    let dataArray;

    svg.defs = svg.layers.data.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect");

    let draw = function draw(data,stackedData,notNormalizedData) {

        dataArray = data;

        // series corresponds to provenance - the columns in the csv table//
        svg.series = svg.layers.data.selectAll(".stackGroup")
            .data(stackedData);

        svg.series.exit().remove();

        svg.seriesEnter = svg.series
            .enter()
            .append("g");


        svg.barGroup = svg.seriesEnter.merge(svg.series)
            .selectAll("g")
            .data(function(d) { return d; });

        // svg.bar = svg.seriesEnter.merge(svg.series).selectAll("rect")
        //     .data(function(d) { return d; });

        svg.barGroup.exit().remove();


        svg.barGroupEnter = svg.barGroup
            .enter()
            .append("g");


        svg.bar = svg.barGroupEnter.merge(svg.barGroup)
            .append("rect")
            .attr("class", "bar")
            ;

        svg.barLabels = svg.barGroupEnter.merge(svg.barGroup)
            .append('text')
            .text(function(d,i) {

                //
            console.log(d);

                    // let items = notNormalizedData[i].filter( (j) => {
                    //   //  console.log(j)
                    //     return j.data.status === d.data.status;
                    // });

              // console.log(items);
                //  console.log(items[0][1]); // [j][i][1]);



                // hier niet het percentage


                // console.log(item);

               //  hij loopt door de statussen

                // console.log(i);

                // if (d.data.status === 'Langer dan twee jaar' && i === 0) {
                //     return item[0]['ontvangst'];
                // } else {
                    return ''; // items[0][1]; //  notNormalizedData[i][0][1]; // item[i][1] - item[i][0];
             //   }


            })  
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
                .style("text-anchor", "start")
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

    let redraw = function redraw(dimensions,xScale,yScale,colours,smallMultiple) {

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

        svg.barGroupMerged = svg.barGroupEnter
            .merge(svg.barGroup);

        svg.bar
            .attr("height", function(d) {
                return dimensions.height
            })

        svg.bar

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
            // .merge(svg.barLabelsEnter)
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
                    return 'translate(' + config.margin.left + ',' + (yScale.band(d[i].data['status']) - 8) + ')';
                }
            })
        ;




    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


