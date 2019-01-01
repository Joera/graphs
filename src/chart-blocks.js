let ChartBlocks = function ChartBlocks(config,svg,functions) {

    let draw = function draw(data) {

        // manipulate the data into stacked series
        // format data for areaflow

        let blocksArray = function(d) {

            let noBlocks = Math.round(parseInt(d[config.yParameter]) / 100);

            // console.log(noBlocks);

            if (Number.isInteger(noBlocks)) {

                let arr = new Array(noBlocks);

                for (let i = 0; i < arr.length; i++) {
                    arr[i] = {};
                    arr[i].previous = d.previous;
                    arr[i].total = d.total;
                    arr[i].cummulative = d.cummulative;
                    arr[i].provenance = d.provenance;
                }

                return arr;
            } else {
                return [];
            }
        }

        let blocksArrayTwo = function(d) {

            let noBlocks = Math.round(parseInt(d['value']) / 100);

            if (Number.isInteger(noBlocks)) {

                let arr = new Array(noBlocks);

                for (let i = 0; i < arr.length; i++) {
                    arr[i] = {};
                    arr[i].previous = 0;
                    arr[i].total = d.value;
                    arr[i].cummulative = 0;
                    arr[i].provenance = d.status;
                }

                return arr;
            } else {
                return [];
            }
        }


        // series corresponds to provenance - the columns in the csv table//

        svg.blockGroup = svg.layers.data.selectAll("g.blocks")
            .data(data)
            .enter()
            .append("g")
            .attr("class", function(d,i) {
                return "blocks " + d.provenance;
            });

        svg.blocks = svg.blockGroup.selectAll(".block")
            .data(function(d) {

                if (d.status) {
                    console.log(d);
                    return blocksArrayTwo(d); // wat komt hier?
                } else {
                    return blocksArray(d);
                }
            })
            .enter()
            .append("rect")
            .attr("width",8)
            .attr("height",8)
            .attr("class", (d,i) => { return 'block ' + d.provenance; })
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

        svg.blockGroup
            .attr("transform", function(d,i) { return 'translate(' + scales.xBand(d[config.xParameter]) + ',' + (config.margin.top + dimensions.height) + ')'})
            .on("mouseout", unhighlight);

        svg.blocks
            .attr("x", (d,i) => { let s = Math.ceil((parseInt(i) + (parseInt(d.previous) / 100))).toString(); return 10 * parseInt(s.substring(s.length - 1)) + 3; })
            .attr("y", (d,i) => {

                let s = Math.ceil((parseInt(i) + (parseInt(d.previous) / 100))).toString();
                if (s.length > 1) {
                    return  - 8 - (10 * parseInt(s.substring(0,s.length - 1)));
                } else {
                    return -8; }
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


