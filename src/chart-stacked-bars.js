let ChartStackedBars = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(data) {

        // manipulate the data into stacked series
        functions.stack = d3.stack();

        let stackedData = functions.stack.keys(data.columns.slice(1))(data);


        // format data for areaflow
        let format = function(stack,index) {

            let areaData = [];

            if(index < (stackedData.length - 1) ) {

                for (let j = 0; j < data.columns.slice(1).length; j++) {  //  -   - 1
                    let pathObject = {};

                    pathObject.x0 = stackedData[index][j].data.status; // key = provenance ... moet status zijn
                    pathObject.x1 = stackedData[index + 1][j].data.status;
                    pathObject.y0 = stackedData[index][j][0];
                    pathObject.y1 = stackedData[index + 1][j][0];
                    pathObject.class = stackedData[index].key;

                    areaData.push(pathObject);
                }
            }
            console.log(areaData);
            return areaData;
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
            // je moet per serie .. de data reformatten
            .data(function(d,i) { return format(d,i); })
            .enter()
            .append("path")
            .attr("fill", "#ccc")
            .attr('class', 'flow');
    }

    let redraw = function redraw(dimensions,scales) {

        let barWidth = 0;

        let area = d3.area()
            // .curve(d3.curveCardinal)
            // console.log(scales.xBand(d[0].data.status)); console.log(scales.xBand(d[1].data.status));
            .x0((d,i) => { if (i < 1) {  return  scales.xBand(d.x0) + barWidth } else { return scales.xBand(d.x0);}})  // console.log(d);
            .x1((d,i) => { if (i < 1) {  return scales.xBand(d.x1) + barWidth } else { return scales.xBand(d.x1); }})
            .y0((d) => { console.log(d); return scales.yLinearReverse(d.y0); })
            .y1((d) => { return scales.yLinearReverse(d.y1); });

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


