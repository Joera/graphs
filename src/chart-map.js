
// moet dit dan toch een class zijn?

let ChartMap = function ChartMap(config,svg,dimensions,smallMultiple) {

    let projection = d3.geoMercator()
        .scale(1)
        .translate([0, 0]);

    let path = d3.geoPath()
        .projection(projection);

    var b = [
            [0.114, -1.101],
            [0.12022108488117365, -1.105]
        ],
        s = .15 / Math.max((b[1][0] - b[0][0]) / dimensions.svgWidth, (b[1][1] - b[0][1]) / dimensions.height),
        t = [((dimensions.svgWidth - s * (b[1][0] + b[0][0])) / 2) + 60 , ((dimensions.height - s * (b[1][1] + b[0][1])) / 2) - 0];

    projection
        .scale(s)
        .translate(t)
    ;


    let draw = function draw(features) {

        svg.map = svg.layers.data.selectAll("path")
            .data(features)
            .enter()
            .append("path")
            .attr("class", function (d, i) {
                return sluggify(d.properties.gemeentenaam);
            })
            .attr("d", path)
            .attr("stroke", "#fff")
            ;

        if (!smallMultiple) {

            svg.values = svg.layers.data.selectAll(".value")
                .data(features)
                .enter()
                .append("text")
                .attr("class", "value small-label")
                .attr("x", function (d) {

                    if (sluggify(d.properties.gemeentenaam) === 'delfzijl') {
                        return path.centroid(d)[0] + 20;
                    } else {
                        return path.centroid(d)[0];
                    }
                })
                .attr("y", function (d) {

                    if (sluggify(d.properties.gemeentenaam) === 'delfzijl') {
                        return path.centroid(d)[1] + 20;
                    } else {
                        return path.centroid(d)[1];
                    }

                })
                .attr("text-anchor", "middle");
        }
    }

    let redraw = function redraw(dimensions,property,yScale,colours) {

        svg.map
            .merge(svg.map)
            .attr("fill", function (d, i) {

                if (d.properties[property] > 0) {
                    return colours[0];
                } else {
                    return '#eee';
                }
            })
            .attr("fill-opacity", function (d, i) {


             //   console.log(d.properties[property]);

                if(d.properties[property] > 0) {
                    return yScale.map(d.properties[property]);
                } else {
                    return 1;
                }
            })
            .on("mouseover", function (d) {

                let html = "<div class='uppercase'>" + d.properties.gemeentenaam + "</div><div>" + d.properties[property] + "</div>";

                if (property === 'TOTAAL_VERLEEND') {
                    html = "<div class='uppercase'>" + d.properties.gemeentenaam + "</div><div>" + convertToCurrency(d.properties[property]) + "</div>";
                }

                if(d.properties[property] && d.properties[property] > 0) {

                    svg.tooltip
                        .html(html)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 5) + "px")
                        .transition()
                        .duration(250)
                        .style("opacity", 1);
                }
            })
            .on("mouseout", function (d) {

                svg.tooltip.transition()
                    .duration(250)
                    .style("opacity", 0);
            });

        if (!smallMultiple) {

            svg.values
                .text(function (d) {

                    if (d.properties[property] > 0) {

                        if (property === 'TOTAAL_VERLEEND' || property === 'bedrag_stuwmeer') {
                            return shortenCurrency(convertToCurrency(d.properties[property]));

                        } else if (property === 'percentage_stuwmeer') {

                            return parseInt(d.properties[property]).toString() + '%';
                        } else {

                            return d.properties[property];
                        }
                    }
                });
        }


    }

    return {
        draw: draw,
        redraw: redraw
    }
}
