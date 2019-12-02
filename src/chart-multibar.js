let ChartMultiBars = function ChartMultiBars(config,svg) {


    let draw = function draw(data) {

        svg.defs = svg.layers.data.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")

            ;

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data);
        
        svg.bar.exit().remove();

        svg.barEnter = svg.bar
            .enter()
            .append("rect")
            .attr("class", function(d,i) {

                return "bar  " + d.colour + " " + d.property;  // + colours[i]; // + sluggify(d.status) + "
            });
    }

    let redraw = function redraw(dimensions,xScale,yScale,property) {

        let offset;

        let popup = function popup(d) {

            return moment(d['_date']).format('DD/MM') + '<br/>' + d.label + '<br/>' + d[d['property']];
        }

        svg.defs
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
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
            .attr("y", function(d) { return config.padding.top + yScale[config.yScaleType](d[d['property']]); })
            .attr("height", function(d) { return dimensions.height - yScale[config.yScaleType](d[d['property']]); });

        svg.bar
            .merge(svg.barEnter)
            .on("mouseover", function(d) {

                svg.tooltip
                    .html(popup(d))
                    .style("right", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px")
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
    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


