let ChartBar = function ChartBar(config,svg) {

    let draw = function draw(data) {

        console.log(data);

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data)

        svg.bar.enter()
            .append("rect")
            .attr("class", function(d) {
                return "bar " + d.status;
            });


        svg.barLabels = svg.layers.data.selectAll(".barLabel")
            .data(data);

        svg.barLabels
            .attr('class','barLabel');

        svg.barLabels.enter().append('text')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "middle")
            .merge(svg.barLabels)
            .text(function(d) {
                    return d.totaal;
            })
            ;


    }

    let redraw = function redraw(dimensions,scales) {

        // let barWidth = ((dimensions.width - config.padding.left - config.padding.right) / data.length) - 2;

        svg.bar
            .merge(svg.bar)
            .attr("x", function(d) { return scales.xBand(d[config.xParameter]); })
            .attr("y", function(d) { return dimensions.height; })
            .attr("height", 0)
            .transition()
            .duration(500)
            .attr("y", function(d) { return config.margin.top + scales.yLinear(d[config.yParameter]); })
            .attr("height", function(d) { return dimensions.height - scales.yLinear(d[config.yParameter]); })
            .attr("width", scales.xBand.bandwidth())
        ;

        svg.barLabels
            .merge(svg.barLabels)
            .attr('transform', function(d) {

                return 'translate(' + (scales.xBand(d[config.xParameter]) + (scales.xBand.bandwidth() / 2)) + ',' +
                    scales.yLinear(d[config.yParameter])
                    + ')';
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


