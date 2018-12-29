let ChartInput = function ChartInput(config,svg,functions) {

    let draw = function draw(data) {

        // manipulate the data into stacked series
        // format data for areaflow

        let blocksArray = function(d) {

            let arr = new Array(parseInt(d.total) / 100);

            return arr;
        }


        // series corresponds to provenance - the columns in the csv table//
        svg.input = svg.layers.data.selectAll(".input")
            .data([{}])
            .enter().append("g")
            .attr("class", "inputs");


        svg.inputGroup = svg.input.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("class", function(d,i) {
                return "input " + d.provenance;
            });

        svg.inputRects = svg.inputGroup.selectAll("rect")
            .data(function(d) { return blocksArray(d); })
            .enter()
            .append("rect")
            .attr("width",8)
            .attr("height",8)
            .attr("x", (d,i) => { let s = i.toString(); return 10 * parseInt(s.substring(s.length - 1)); })
            .attr("y", (d,i) => { let s = i.toString(); return 10 * parseInt(s.substring(0,s.length - 1)); });

        // svg.connection = svg.input.selectAll('.flow')
        //     // je moet per serie .. de data reformatten
        //     .data(function(d,i) { return format(d,i); })
        //     .enter()
        //     .append("path")
        //     .attr("fill", "#ccc")
        //     .attr('class', 'flow');
    }

    let redraw = function redraw(dimensions,scales) {

        let barWidth = 0;

        // let area = d3.area()
        //     .curve(d3.curveCardinal)
        //     .x0((d,i) => { if (i < 1) {  return  scales.xBand(d.x) + scales.xBand.bandwidth() } else { return scales.xBand(d.x);}})  // console.log(d);
        //     .x1((d,i) => { if (i < 1) {  return scales.xBand(d.x) + scales.xBand.bandwidth() } else { return scales.xBand(d.x); }})
        //     .y0((d,i) => { return scales.yLinear(d.base); })
        //     .y1((d) => { return scales.yLinear(d.y); });

        // svg.inputGroup.attr("class", function(d,i) {
        //     // console.log(d);
        //     return d.data.provenance;
        // });

        svg.inputGroup
            .attr("transform", function(d) { return 'translate(64,' + dimensions.height - scales.yInputLinear('2200') + ')'});
          //  .attr("transform", function(d) { return 'translate(64,' + scales.yInputLinear(d['cummulative'])+ ')'});

        // svg.inputRects
        //     .attr("y", function(d) { return scales.yInputLinear(d['cummulative']); })
        //     .attr("height", function(d) { return scales.yInputLinear(d[0]) - scales.yInputLinear(d[1]); })
        //     .attr("x", 62)
        //     .attr("width", 120)



        // svg.connection
        //     .attr("d", area);

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


