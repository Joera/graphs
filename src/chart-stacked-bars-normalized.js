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
            .data(function(d) {
                return d;

            });

        svg.barGroup.exit().remove();

        svg.barGroupEnter = svg.barGroup
            .enter()
            .append("g");


        // dit moet beter kunnen!
        d3.selectAll(".bar").remove();
        d3.selectAll(".barLabel").remove();

        svg.bar = svg.barGroup.merge(svg.barGroupEnter)
            .append("rect")
            .attr("class", "bar")
            ;

        svg.bar.exit().remove();

        svg.barLabels = svg.barGroup.merge(svg.barGroupEnter)
            .append('text')
            .attr('class','barLabel small-label white')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "middle")
        ;

        svg.barLabels.exit().remove();

            svg.dateLabels = svg.layers.axes.selectAll(".dateLabel")
                .data(stackedData);

            svg.dateLabelsEnter = svg.dateLabels
                .enter()
                .append('text')
                .attr('class', 'dateLabel small-label')
                .attr('x', 0)
                .attr('dx', config.padding.left)
                .attr('dy', '3px')
                .style("text-anchor", "start")
                .attr('fill-opacity', 0)
                .transition()
                .delay(500)
                .duration(500)
                .attr('fill-opacity', 1);
    }

    let redraw = function redraw(dimensions,xScale,yScale,colours,smallMultiple) {

        let yOffset;
        let xOffset;

        svg.defs
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);

        svg.series = svg.seriesEnter
            .merge(svg.series)
            .attr("class", (d,i) => {

                return "stackGroup " + colours[d.key] + " " + d.key;
            });

        svg.barGroupMerged = svg.barGroupEnter
            .merge(svg.barGroup);

        svg.bar

            .attr("y", function(d) {
                return yScale.band(d.data[config.xParameter]);
            })
            .attr("height", function(d) {
                    return yScale.band.bandwidth();
            })
            .transition()
            .duration(500)
            .attr("x", function(d) { return xScale.stackedNormalized(d[0]); })
            .attr("width", function(d) {
                return xScale.stackedNormalized(d[1]) - xScale.stackedNormalized(d[0]);
            })
           ;

        svg.barLabels

            .text(function(d,i) {
                
                if (this.parentNode.parentNode.classList.contains('ontvangst')) {

                    if (d.data['ontvangst'] > 0) return d.data['ontvangst']

                } else if (this.parentNode.parentNode.classList.contains('planning_opname')) {

                    if (d.data['planning_opname'] > 0) return d.data['planning_opname']

                } else if (this.parentNode.parentNode.classList.contains('opleveren_schaderapport')) {

                    if (d.data['opleveren_schaderapport'] > 0) return d.data['opleveren_schaderapport']

                } else if (this.parentNode.parentNode.classList.contains('voorbereiden_commissie')) {

                    if (d.data['voorbereiden_commissie'] > 0) return d.data['voorbereiden_commissie']

                } else if (this.parentNode.parentNode.classList.contains('stuwmeer')) {

                    if (d.data['stuwmeer'] > 0)  return d.data['stuwmeer']
                }

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


