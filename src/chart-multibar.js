let ChartMultiBars = function ChartMultiBars(config,svg) {


    let draw = function draw(data) {

        console.log(data);

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data);
        
        svg.bar.exit().remove();

        svg.barEnter = svg.bar
            .enter()
            .append("rect")
            .attr("class", function(d,i) {

                return "bar  " + d.colour + " " + d.property;  // + colours[i]; // + sluggify(d.status) + "
            });

        // svg.barLabels = svg.layers.data.selectAll(".barLabel")
        //     .data(data);
        //
        // svg.barLabels.exit().remove();
        //
        // svg.barLabelsEnter = svg.barLabels
        //     .enter()
        //     .append('text')
        //     .attr('class','barLabel small-label')
        //     .attr('x', 0)
        //     .attr('dx', '0px')
        //     .attr('dy', '-6px')
        //     .style("text-anchor", "middle")
        //
        //     ;
    }

    let redraw = function redraw(dimensions,xScale,yScale,property) {

        let offset;

        svg.bar
            .merge(svg.barEnter)
            .attr("x", function(d) {

                    offset = (d.property === property) ? -30 : 0;
                    return xScale[config.xScaleType](new Date(d[config.xParameter])) + offset;
            })
            .attr("y", function(d) { return dimensions.height; })
            .attr("height", 0)
            .attr("width", function(d) {

                    return 30;
            })
            .transition()
            .duration(500)
            .attr("y", function(d) { return config.margin.top + yScale[config.yScaleType](d[d['property']]); })
            .attr("height", function(d) { return dimensions.height - yScale[config.yScaleType](d[d['property']]); })  // add

        ;

        // svg.barLabels
        //     .merge(svg.barLabelsEnter)
        //     .text(function(d) {
        //
        //         if(config.currencyLabels) {
        //
        //             return convertToCurrency(d[config.yParameter]);
        //
        //         } else {
        //
        //             return d[config.yParameter] ? d[config.yParameter] : '< 25';
        //         }
        //
        //
        //     })
        //     .attr('transform', function(d) {
        //
        //
        //             return 'translate(' + (xScale[config.xScaleType](new Date(d[config.xParameter]))) + 60 + ',' +
        //                 yScale.linear(d[config.yParameter])
        //                 + ')';
        //
        //
        //     })
        //     .attr('fill-opacity', 0)
        //     .transition()
        //     .delay(500)
        //     .duration(500)
        //     .attr('fill-opacity', 1)
    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


