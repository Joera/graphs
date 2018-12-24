let ChartStackedBars = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(data) {

        // manipulate the data into stacked series
        functions.stack = d3.stack();

            // var series = stack(data);
            // console.log(series);



        // series corresponds to provenance - the columns in the csv table//
        svg.series = svg.layers.data.selectAll(".serie")
            .data(functions.stack.keys(data.columns.slice(1))(data))
            .enter().append("g")
            .attr("class", "serie")
            // .attr("fill", function(d) { return z(d.key); })

        svg.bar = svg.series.selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect");


    }

    let redraw = function redraw(dimensions,scales) {

        svg.bar
            .attr("y", function(d) { return scales.yLinearReverse(d[1]); })
            .attr("height", function(d) { return scales.yLinearReverse(d[1]) - scales.yLinearReverse(d[0]); })
            .attr("x", function(d) { return scales.xBand(d.data[config.xParameter]); })
            .attr("width", scales.xBand.bandwidth());

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


