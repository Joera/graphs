let ChartBlocks = function ChartBlocks(config,svg,functions) {

    let draw = function draw(data) {

        // manipulate the data into stacked series
        // format data for areaflow

        let blocksArray = function(d) {

            let noBlocks = Math.round(parseInt(d.total) / 100);
            let arr = new Array(noBlocks);

            for (let i = 0; i < arr.length; i++) {
                arr[i] = {};
                arr[i].previous = d.previous;
                arr[i].total = d.total;
                arr[i].cummulative = d.cummulative;
                arr[i].provenance = d.provenance;
            }
            return arr;
        }


        // series corresponds to provenance - the columns in the csv table//

        svg.inputGroup = svg.layers.data.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("class", function(d,i) {
                return "blocks " + d.provenance;
            });

        svg.inputRects = svg.inputGroup.selectAll("rect")
            .data(function(d) { return blocksArray(d); })
            .enter()
            .append("rect")
            .attr("width",8)
            .attr("height",8)
            .attr("class", (d,i) => { return d.provenance; })
        ;

    }

    let redraw = function redraw(dimensions,scales) {

        let barWidth = 0;

        function unhighlight() {
            d3.select('.procedure-container svg').attr('class', null)
        }

        function highlight(provenance) {
            d3.select('.procedure-container svg').attr('class', provenance)
        }

        svg.inputGroup
            .attr("transform", function(d,i) { console.log(d); return 'translate(' + scales.xBand(i) + ',' + (config.margin.top + dimensions.height) + ')'})
            .on("mouseout", unhighlight);

        svg.inputRects
            .attr("x", (d,i) => { let s = Math.ceil((parseInt(i) + (parseInt(d.previous) / 100))).toString(); return 10 * parseInt(s.substring(s.length - 1)) + 3; })
            .attr("y", (d,i) => {

                let s = Math.ceil((parseInt(i) + (parseInt(d.previous) / 100))).toString();
                if (s.length > 1) {
                    return  0 - (10 * parseInt(s.substring(0,s.length - 1)));
                } else {
                    return 0; }
            })
            .on("mouseover", (d,i) => {
                highlight(d.provenance);
            });

    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


