let ChartStackedBars = function ChartStackedBars(config,svg,functions) {

    let dataArray;

    let draw = function draw(data,stackedData,colours) {


        dataArray = data;


/////////////////////////

        // uncommented code was voor triangles in between the bars .....

        // let calcBase = function(index,status) {
        //     // get out of status loop
        //     let base = 0;
        //         // this loops through provenances width max of (current index) s
        //         for (let i = 0; i < index; i++) {
        //             base = stackedData[i][status][1];
        //         }
        //         return base;
        //     // }
        // }

        // format data for areaflow
        // let format = function(stack,index) {
        //     // this loops through provenances
        //
        //     let areaData = [];
        //
        //     if(index < (stackedData.length) ) {
        //
        //         // this loops through status
        //         for (let j = 0; j < 3; j++) {  //  -
        //             let pathCombo = [], pathObject = {}, nextPathObject = {};
        //
        //             pathObject.x = stackedData[index][j].data.status;
        //             pathObject.y = stackedData[index][j][1];
        //             pathObject.base = calcBase(index,j);
        //             pathObject.class = stackedData[index].key;
        //             pathCombo.push(pathObject);
        //
        //             nextPathObject.x = stackedData[index][j+1].data.status;
        //             nextPathObject.y = stackedData[index][j+1][1];
        //             nextPathObject.base = calcBase(index,j+1);
        //             nextPathObject.class = stackedData[index].key;
        //             pathCombo.push(nextPathObject);
        //
        //             areaData.push(pathCombo);
        //         }
        //     }
        //
        //     return  areaData;
        // }



        // series corresponds to provenance - the columns in the csv table//
        svg.series = svg.layers.data.selectAll(".serie")
            .data(stackedData)
            .enter().append("g")
            .attr("class", (d,i) => {

                if (i === 0 || !!(i && !(i%2))) {
                    return "stackGroup " + colours[0];
                } else {
                    return "stackGroup " + colours[1];
                }
            });

        svg.bar = svg.series.selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("class", "bar")
            ;

        svg.barLabels = svg.series.selectAll(".barLabel")
            .data(function(d) { return d; })
            .enter()
            .append('text')
            .attr('class','barLabel small-label white')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "middle")

        ;

        // svg.connection = svg.series.selectAll('.flow')
        //     // je moet per serie .. de data reformatten
        //     .data(function(d,i) { return format(d,i); })
        //     .enter()
        //     .append("path")
        //     .attr("fill", "#ccc")
        //     .attr('class', 'flow');

        if(config.xParameter === "_date") {

            svg.dateLabels = svg.series.selectAll(".dateLabel")
                .data(function(d) { return d; })
                .enter()
                .append('text')
                .attr('class','dateLabel small-label')
                .attr('x', 0)
                .attr('dx', '0px')
                .attr('dy', '22px')
                .style("text-anchor", "middle")

            ;
        }
    }

    let redraw = function redraw(dimensions,scales) {

        let barWidth = 0;
        let yOffset;
        let xOffset;


        // let area = d3.area()
        //     .curve(d3.curveCardinal)
        //     .x0((d,i) => {
        //
        //         if (config.xParameter === '_date') {
        //
        //             return  scales.xTime(new Date(d.x));
        //
        //         } else if (i < 1) {
        //
        //             return  scales.xBand(d.x) + scales.xBand.bandwidth()
        //
        //         } else {
        //
        //             return scales.xBand(d.x);
        //         }
        //
        //     })  // console.log(d);
        //     .x1((d,i) => {
        //
        //         if (i < 1) {  return scales.xBand(d.x) + scales.xBand.bandwidth() } else { return scales.xBand(d.x); }
        //
        //     })
        //     .y0((d,i) => { return scales.yBlocks(d.base); })
        //     .y1((d) => { return scales.yBlocks(d.y); });
        //

        svg.layers.data.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);




        svg.bar
            .merge(svg.bar)
            .attr("y", function(d) { return scales.yLinear(d[1]); })
            .attr("height", function(d) {
                return scales.yLinear(d[0]) - scales.yLinear(d[1]);

            })
            .attr("x", function(d) {

                if(config.xParameter === "_date") {

                    return scales.xTime(new Date(d.data[config.xParameter]));

                } else {

                    return scales.xBand(d.data[config.xParameter]);
                }
            })
            .attr("width", function(d) {

                if(config.xParameter === "_datee") {

                    return dimensions.width / dataArray.length;

                } else {

                    return scales.xBand.bandwidth();
                }
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

                xOffset = dimensions.width / (2 * dataArray.length);
                let start = (d[0] < config.minValue) ? config.minValue : d[0];
                yOffset = ((scales.yLinear(d[1]) - scales.yLinear(start)) / 2) - 11;

                if (config.xParameter === '_datee') {
                    
                    return 'translate(' + (scales.xTime(new Date(d.data[config.xParameter])) + xOffset)  + ',' +
                        (scales.yLinear(d[1]) - yOffset)
                        + ')';

                } else {

                    return 'translate(' + (scales.xBand(d.data[config.xParameter]) + (scales.xBand.bandwidth() / 2)) + ',' +
                        (scales.yLinear(d[1]) - yOffset)
                        + ')';
                }
            })
            .attr('fill-opacity', 0)
            .transition()
            .delay(500)
            .duration(500)
            .attr('fill-opacity', 1);

        if(config.xParameter === "_date") {

            svg.dateLabels
                .merge(svg.dateLabels)
                .text(function(d) {

                    return new Date(d.data['_date']).toLocaleDateString('nl-NL',{ month: 'long', day: 'numeric'});
                })
                // .attr('transform', function(d) {
                //
                //         xOffset = dimensions.width / (2 * dataArray.length);
                //
                //         return 'translate(' + (scales.xBand(d.data[config.xParameter]) + xOffset)  + ',' +
                //             dimensions.height
                //             + ')';
                // })
                .attr('fill-opacity', 0)
                .transition()
                .delay(500)
                .duration(500)
                .attr('fill-opacity', 1);


        }
        //
        // svg.connection
        //     .attr("d", area);

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


