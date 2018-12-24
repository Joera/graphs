let ChartStackedBars = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(data) {

        // manipulate the data into stacked series
        functions.stack = d3.stack();

            // var series = stack(data);
            // console.log(series);

        svg.series = g.selectAll(".serie")
            .data(functions.stack.keys(data.columns.slice(1))(data))
            .enter().append("g")
            .attr("class", "serie")
            // .attr("fill", function(d) { return z(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data[config.xParameter]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })


    }

    let redraw = function redraw(dimensions,scales) {

        svg.series.attr("width", x.bandwidth());

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


