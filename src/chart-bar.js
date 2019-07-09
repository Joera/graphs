let ChartBar = function ChartBar(config,svg) {

    let draw = function draw(data) {

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data)

        svg.bar.enter()
            .append("rect")
            .attr("class", function(d) {
                return "bar " + sluggify(d.status);
            });

        svg.barLabels = svg.layers.data.selectAll(".barLabel")
            .data(data);

        svg.barLabels.enter().append('text')
            .attr('class','barLabel')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-6px')
            .style("text-anchor", "middle")

            ;
    }

    // let enter = function enter() {
    //
    //     svg.bar
    //         .enter()
    //         .append("rect")
    //         .attr("class", function(d) {
    //             return "bar " + d.status;
    //         });
    //
    // }

    let redraw = function redraw(dimensions,scales) {


        console.log('barrrrrr');
        // let barWidth = ((dimensions.width - config.padding.left - config.padding.right) / data.length) - 2;

        svg.bar
            .merge(svg.bar)
            .attr("x", function(d) { console.log(d); return scales.xBand(d[config.xParameter]); })
            .attr("y", function(d) { return dimensions.height; })
            .attr("height", 0)
            .transition()
            .duration(500)
            .attr("y", function(d) { return config.margin.top + scales.yLinear(d[config.yParameter]); })
            .attr("height", function(d) { return dimensions.height - scales.yLinear(d[config.yParameter]); })
            .attr("width", scales.xBand.bandwidth())
        ;

        svg.bar.exit().remove();

        svg.barLabels
            .merge(svg.barLabels)
            .text(function(d) {
                return d.totaal;
            })
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


