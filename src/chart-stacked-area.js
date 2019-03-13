let ChartStackedArea = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(stackedData) {

        svg.series = svg.layers.data.selectAll(".serie")
            .data(stackedData)
            .enter().append("g")
            .attr("class", (d) => { return "serie " + d.key });
        // .attr("fill", function(d) { return z(d.key); })

        svg.areas = svg.series.selectAll('.flow')
        // je moet per serie .. de data reformatten
            .data(stackedData)
            .enter()
            .append("path")
            .attr("fill", "#ccc")
            .attr('class', 'flow');


        console.log(stackedData);

    }

    let redraw = function redraw(dimensions,scales) {


        let area = d3.area()
            .x(function(d) {
                return x(d.data.date); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); });


    }




    return  {
        draw : draw,
        redraw : redraw
    }

}
