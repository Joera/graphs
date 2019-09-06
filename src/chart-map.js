let ChartMap = function ChartLine(config,svg) {

    let draw = function draw(features) {

        svg.map = svg.layers.data.selectAll("path")
            .data(features)
            .enter()
            .append("path")
            .attr("class", function (d, i) {
                return sluggify(d.properties.gemeentenaam);
            })
            .attr("d", path)
            .attr("stroke", function (d, i) {

                if (d.properties[property]) {
                    return '#fff';
                } else {
                    return '#fff';
                }
            })
            ;
    }

    let redraw = function redraw(dimensions,roperty) {

        svg.map
            .merge(svg.map)
            .attr("fill", function (d, i) {

                if (d.properties[property]) {
                    return 'orange';
                } else {
                    return '#eee';
                }
            })
            .attr("fill-opacity", function (d, i) {

                let ratio = .8 * d.properties[property] / 1500;
                return ratio + 0.2;
            })
            .on("mouseover", function (d) {

                if(d.properties[property]) {

                    d3.select(this).attr("fill-opacity", 1);
                }

                let html = "<span class='uppercase'>" + d.properties.gemeentenaam + "</span>";

                svg.tooltip
                    .html(html)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 5) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", function (d) {

                if (d.properties[property]) {

                    d3.select(this).attr("fill-opacity", .4);
                }

                svg.tooltip.transition()
                    .duration(250)
                    .style("opacity", 0);
            });


    }

    return {
        draw: draw,
        redraw: redraw
    }
}
