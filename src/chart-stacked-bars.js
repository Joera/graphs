let ChartStackedBars = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(data) {

        // manipulate the data into stacked series
        functions.stack = d3.stack();

        let stackedData = functions.stack.keys(data.columns.slice(1))(data);


        // format data for areaflow
        let areaData = [];
        // for every provenance
        for (let i = 0; i < stackedData.length - 1; i++) {  //  -
            // for every status
            for (let j = 0; j < data.columns.slice(1).length - 1; j++) {  //  -
                areaData.push([stackedData[i][j],stackedData[i][j + 1]]);
            }
        }


        // series corresponds to provenance - the columns in the csv table//
        svg.series = svg.layers.data.selectAll(".serie")
            .data(stackedData)
            .enter().append("g")
            .attr("class", (d) => { return "serie " + d.key });
            // .attr("fill", function(d) { return z(d.key); })

        svg.bar = svg.series.selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect");

        svg.connection = svg.series.selectAll('.flow')
            .data(areaData)
            .enter()
            .append("path")
            .attr("fill", "#ccc")
            .attr('class', 'flow');
    }

    let redraw = function redraw(dimensions,scales) {

        let barWidth = 0;

        let area = d3.area()
            .curve(d3.curveCardinal)
            .x0((d,i) => { if (i < 1) { return scales.xBand(d[0][1]) + barWidth } else { return scales.xBand(d[0][1]);}})  // console.log(d);
            .x1((d,i) => { if (i < 1) { return scales.xBand(d[1][1]) + barWidth } else { return scales.xBand(d[1][1]); }})
            .y0(scales.yLinear(d[0][0]))
            .y1((d) => { return scales.yLinear(d[1][0]); });

        svg.bar
            .attr("y", function(d) { return scales.yLinear(d[1]); })
            .attr("height", function(d) { return scales.yLinearReverse(d[1]) - scales.yLinearReverse(d[0]); })
            .attr("x", function(d) { return scales.xBand(d.data[config.xParameter]); })
            .attr("width", scales.xBand.bandwidth());

        svg.connection
            .attr("d", area);

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


