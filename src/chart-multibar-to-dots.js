let ChartMultiBarsToDots = function ChartMultiBarsToDots(config,svg) {


    let draw = function draw(data) {

        svg.defs = svg.layers.data.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")

            ;

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data.filter( (d) => { return d.timeframe === 'totals' }));
        
        svg.bar.exit().remove();

        svg.barEnter = svg.bar
            .enter()
            .append("rect")
            .attr("class", function(d,i) {

                return "bar  " + d.property;  // + colours[i]; // + sluggify(d.status) + "
            })
            .style("fill", function(d) {
                return d.colour;
            });


        svg.circles = svg.layers.data.selectAll(".circle")
            .data(data.filter( (d) => { return (d.timeframe === 'week' && d[d.property] > 0) }));

        svg.circles.exit().remove();

        svg.circlesEnter = svg.circles
            .enter()
            .append("circle")
            .attr("class", function(d,i) {

                return "circle  " + d.property;
            })
            .attr("r", config.circleRadius)
            .style("fill", function(d) {
                return d.colour;
            });
    }

    let redraw = function redraw(dimensions,xScale,yScale,timeframe) {

        let offset;

        let popup = function popup(d) {

            return moment(d['_date']).format('DD/MM') + '<br/>' + d.label + '<br/>' + d[d['property']];
        }

        svg.defs
            .attr("width", dimensions.width)
            .attr("height", config.padding.top + dimensions.height)
            .attr("transform", "translate(" + (config.padding.left + config.barWidth ) + ",0)");

        svg.bar
            .merge(svg.barEnter)
            .attr("x", function(d,i) {

                offset = (i % 2) ? 0 : - (config.barWidth + 0);

                return xScale[config.xScaleType](new Date(d[config.xParameter])) + offset;
            })
            .attr("y", function(d) { return dimensions.height; })
            .attr("height", 0)
            .attr("width", function(d) {

                return config.barWidth;
            })
            .attr("clip-path", "url(#clip)")
            .transition()
            .duration(500)
            .attr("y", function(d) {  return config.padding.top + yScale[config.yScaleType](d[d.property]); })
            .attr("height", function(d) {

                return (timeframe === 'totals') ?  dimensions.height - yScale[config.yScaleType](d[d.property]) : 0;

            });


        svg.circles
            .merge(svg.circlesEnter)
            .attr("cx", function(d,i) {

                offset = (i % 2) ? 0 : - (config.barWidth + 0);

                return xScale[config.xScaleType](new Date(d[config.xParameter]));
            })
            .attr("cy", function(d) { return dimensions.height; })
            .attr("clip-path", "url(#clip)")
            .transition()
            .duration(500)
            .attr("cy", function(d) {

                return (timeframe === 'week') ? config.padding.top + yScale[config.yScaleType](d[d.property]) : dimensions.height + 40;

            })

        ;

        svg.bar
            .merge(svg.barEnter)
            .on("mouseover", function(d) {

                svg.tooltip
                    .html(popup(d))
                    .style("left", (d3.event.pageX - 205) + "px")
                    .style("top", (d3.event.pageY - 5) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                svg.tooltip.transition()
                    .duration(250)
                    .style("opacity", 0);
            })// add

        ;

        svg.circles
            .merge(svg.circlesEnter)
            .on("mouseover", function(d) {

                svg.tooltip
                    .html(popup(d))
                    .style("left", (d3.event.pageX - config.tooltipWidth) + "px")
                    .style("top", (d3.event.pageY - 5) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                svg.tooltip.transition()
                    .duration(250)
                    .style("opacity", 0);
            })// add
    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


