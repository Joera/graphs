let ChartStackedBars = function ChartStackedBars(config,svg,functions) {

    let draw = function draw(data) {

        // manipulate the data into stacked series
        functions.stack = d3.stack();

        let stackedData = functions.stack.keys(data.columns.slice(1))(data);

        let calcBase = function(index,status) {
            // get out of status loop
            let base = 0;
            // this loops through provenances
            for (let i = 0; i < index + 1; i++) {
                console.log(stackedData[i]);
                base = base + stackedData[i][status][1];
            }
            return base;
        }

        // format data for areaflow
        let format = function(stack,index) {
            // this loops through provenances

            let areaData = [];

            if(index < (stackedData.length - 1) ) {

                // this loops through status
                for (let j = 0; j < 1; j++) {  //  -   data.columns.slice(1).length - 1
                    let pathCombo = [], pathObject = {}, nextPathObject = {};

                    pathObject.x = stackedData[index][j].data.status;
                    pathObject.y = stackedData[index][j][1];
                    if(index > 0) {
                        pathObject.base = calcBase(index, j) + stackedData[index + 1][j][1];
                    } else {
                        pathObject.base = calcBase(index, j);
                    }
                    pathObject.class = stackedData[index].key;
                    pathCombo.push(pathObject);

                    // base = base + stackedData[index][j+1][1];
                  //   console.log(base);

                    nextPathObject.x = stackedData[index][j+1].data.status;
                    nextPathObject.y = stackedData[index][j+1][1];
                    nextPathObject.base = calcBase(index,j);
                    nextPathObject.class = stackedData[index].key;
                    pathCombo.push(nextPathObject);

                    areaData.push(pathCombo);


                }
            }
            // console.log(areaData);
            return  areaData;
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
            .x0((d,i) => { if (i < 1) {  return  scales.xBand(d.x) + scales.xBand.bandwidth() } else { return scales.xBand(d.x);}})  // console.log(d);
            .x1((d,i) => { if (i < 1) {  return scales.xBand(d.x) + scales.xBand.bandwidth() } else { return scales.xBand(d.x); }})
            .y0((d) => { console.log(d); return scales.yLinearReverse(d.base); })
            .y1((d) => { return scales.yLinear(d.y); });

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


