let ChartBar = function ChartBar(config,svg) {

    let draw = function draw(data) {

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar");

    }

    let redraw = function redraw(dimensions,scales,data) {

        // let barWidth = ((dimensions.width - config.padding.left - config.padding.right) / data.length) - 2;

        svg.bar
            .attr("x", function(d) { return scales.xBand(d[config.xParameter]); })
            .attr("y", function(d) { return config.margin.top + scales.yLinear(d[config.yParameter]); })
            .attr("height", function(d) { return dimensions.height - scales.yLinear(d[config.yParameter]); })
            .attr("width", scales.xBand.bandwidth())
        ;
    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


