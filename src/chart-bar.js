let ChartBar = function ChartBar(config,svg) {

    let draw = function draw(data) {

        svg.bar = svg.layers.data.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar");

    }

    let redraw = function redraw(dimensions,scales,data) {

        let barWidth = ((dimensions.width - config.padding.left - config.padding.right) / data.length) - 2;

        svg.bar
            .attr("x", function(d) { return scales.xTime(new Date(d.date)); })
            .attr("y", function(d) { return scales.yLinear(d.value); })
            .attr("height", function(d) { return dimensions.height - scales.yLinear(d.value); })
            .attr("width", barWidth);
    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


