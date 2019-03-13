let ChartStackedArea = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(stackedData) {

        svg.series = svg.layers.data.selectAll(".serie")
            .data(stackedData)
            .enter().append("g")
            .attr("class", (d) => { return "serie " + d.key });
        // .attr("fill", function(d) { return z(d.key); })

        svg.areas = svg.series
            .append("path")
            .attr("fill", "#ccc")
            .attr('class', 'flow');


        console.log(stackedData);

    }

    let redraw = function redraw(dimensions,scales) {

        console.log('yo');

        let area = d3.area()
            .x(function(d) {
                return scales.xTime(new Date(d.data.date)); })
            .y0(function(d) { return scales.yLinear(d[0]); })
            .y1(function(d) { return scales.yLinear(d[1]); });

        svg.areas
            .attr('d', area);

    }




    return  {
        draw : draw,
        redraw : redraw
    }

}
