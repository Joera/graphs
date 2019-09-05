let ChartBar = function ChartBar(config,svg) {

    let draw = function draw(data,colours) {

        console.log(data);

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", function(d,i) {
                return "bar  " + colours[i]; // + sluggify(d.status) + "
            });


        svg.barLabels = svg.layers.data.selectAll(".barLabel")
            .data(data)
            .enter()
            .append('text')
            .attr('class','barLabel small-label')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "middle")

            ;
    }

    let redraw = function redraw(dimensions,scales) {


        // let barWidth = ((dimensions.width - config.padding.left - config.padding.right) / data.length) - 2;

        // is date or not date

        svg.bar
            .merge(svg.bar)
            .attr("x", function(d) {

                if (config.xParameter === '_date') {

                    return scales.xTime(new Date(d[config.xParameter]));

                } else {

                    return scales.xBand(d[config.xParameter]);
                }
            })
            .attr("y", function(d) { return dimensions.height; })
            .attr("height", 0)
            .transition()
            .duration(500)
            .attr("y", function(d) { return config.margin.top + scales.yLinear(d[config.yParameter]); })
            .attr("height", function(d) { return dimensions.height - scales.yLinear(d[config.yParameter]); })
            .attr("width", function(d) {

                if (config.xParameter === '_date') {

                     return 60;
                } else {

                    return scales.xBand.bandwidth()
                }

            })
        ;

        svg.bar.exit().remove();

        svg.barLabels
            .merge(svg.barLabels)
            .text(function(d) {
                return d.totaal;
            })
            .attr('transform', function(d) {

                if (config.xParameter === '_date') {

                    return 'translate(' + (scales.xTime(d[config.xParameter]) + 60 + ',' +
                        scales.yLinear(d[config.yParameter])
                        + ')';

                } else {

                    return 'translate(' + (scales.xBand(d[config.xParameter]) + (scales.xBand.bandwidth() / 2)) + ',' +
                        scales.yLinear(d[config.yParameter])
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


