let ChartBarVertical = function ChartBarVertical(config,svg) {

    let draw = function draw(data,colours) {


        svg.barGroup = svg.layers.data.selectAll(".barGroup")
            .data(data);

        svg.barGroup.exit().remove();

        svg.barGroupEnter = svg.barGroup
            .enter()
            .append("g")
            .attr("class", "barGroup")
            ;

        svg.bar = svg.barGroup.merge(svg.barGroupEnter).selectAll(".bar")
            .data( function(d) { return d.data });
        
        svg.bar.exit().remove();

        svg.barEnter = svg.bar
            .enter()
            .append("rect")
            .attr("class", function(d,i) {

                console.log(d);

                return "bar " + colours[Object.keys(d)[0]]; // + sluggify(d.status) + "
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

    let redraw = function redraw(dimensions,xScale,yScale) {

        let barHeight = 32;
        let barSpacing = 4;


        svg.bar
            .merge(svg.barEnter)
            .attr("x", 0)
            .attr("y", function(d,i) { return (i *  barHeight) + (i * barSpacing)})
            .attr("height", barHeight)
            .attr("width", 0)
            .transition()
            .duration(500)
            .attr("width", function(d) {
                return 200; // xScale.linear(Object.values(d)[0])
            })

        ;

        // svg.barLabels
        //     .merge(svg.barLabelsEnter)
        //     .text(function(d) {
        //
        //         if(config.currencyLabels) {
        //
        //             return convertToCurrency(d.totaal);
        //
        //         } else {
        //             return d.totaal;
        //         }
        //
        //
        //     })
        //     .attr('transform', function(d) {
        //
        //         if (config.xParameter === '_date') {
        //
        //             return 'translate(' + (xScale.time(new Date(d[config.xParameter]))) + 60 + ',' +
        //                 yScale.linear(d[config.yParameter])
        //                 + ')';
        //
        //         } else {
        //
        //             return 'translate(' + (xScale.band(d[config.xParameter]) + (xScale.band.bandwidth() / 2)) + ',' +
        //                 yScale.linear(d[config.yParameter])
        //                 + ')';
        //         }
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


