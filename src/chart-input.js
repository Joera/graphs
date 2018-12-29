let ChartInput = function ChartInput(config,svg,functions) {

    let draw = function draw(data) {

        // manipulate the data into stacked series
        functions.stack = d3.stack();

        let stackedData = functions.stack.keys(data.columns.slice(1))(data);

        let cummulative = 0;

        stackedData.forEach( (s) => {

            cummulative = cummulative + s[1];
            s[3] = cummulative;
        });

        console.log(stackedData);

        let calcBase = function(index,status) {
            // get out of status loop
            let base = 0;
                // this loops through provenances width max of (current index) s
                for (let i = 0; i < index; i++) {
                    base = stackedData[i][status][1];
                }
                return base;
            // }
        }

        // format data for areaflow
        let format = function(stack,index) {
            // this loops through provenances

            let areaData = [];

            if(index < (stackedData.length) ) {

                // console.log(stackedData[index]);

                // this loops through status
                for (let j = 0; j < 3; j++) {  //  -
                    let pathCombo = [], pathObject = {}, nextPathObject = {};

                    pathObject.x = stackedData[index][j].data.status;
                    pathObject.y = stackedData[index][j][1];
                    pathObject.base = calcBase(index,j);
                    pathObject.class = stackedData[index].key;
                    pathCombo.push(pathObject);

                    nextPathObject.x = stackedData[index][j+1].data.status;
                    nextPathObject.y = stackedData[index][j+1][1];
                    nextPathObject.base = calcBase(index,j+1);
                    nextPathObject.class = stackedData[index].key;
                    pathCombo.push(nextPathObject);

                    areaData.push(pathCombo);
                }
            }

            return  areaData;
        }

        // series corresponds to provenance - the columns in the csv table//
        svg.input = svg.layers.data.selectAll(".input")
            .data(stackedData)
            .enter().append("g")
            .attr("class", (d) => { return "input " + d.key });
            // .attr("fill", function(d) { return z(d.key); })

        svg.inputBars = svg.input.selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect");

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

        svg.inputBars
            .attr("y", function(d) { return scales.yInputLinear(d[1]); })
            .attr("height", function(d) { return scales.yInputLinear(d[0]) - scales.yInputLinear(d[1]); })
            .attr("x", 62)
            .attr("width", 120)
            .attr("class", function(d,i) {
                console.log(d);
                return d.data.provenance;
            });


        // svg.connection
        //     .attr("d", area);

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


