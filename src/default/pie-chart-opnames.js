var pieChartOpnames = function(element,smallMultiple) {

    let municipalitySelect = document.querySelector('select.municipalities');

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let functions = chartObjects.functions();

    config.margin.top = 0;
    config.margin.bottom = (window.innerWidth > 640) ? 0 : 75;
    config.margin.left = 200;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 50;
    config.padding.left = 30;
    config.padding.right = 0;
    // config.xParameter = 'status';  // name of first column with values of bands on x axis
    // config.yParameter = 'totaal';  // is being set in type function
    config.currencyLabels = true;


    config.maxHeight = 300;

    config.colours = d3.scaleOrdinal()
        .range([green,darkblue,blue,orange,grey]);

    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element,config,dimensions,svg);

    let chartPie = ChartPie(config,svg,functions);

    let url = 'https://tcmg-hub.publikaan.nl/api/gemeentes';

    d3.json(url, function(error, json) {

        function prepareData(json,filter) {

            json = json.filter( j => j['_category'] === filter)[0];

            let data = [];

            data.push({
                status: "Aannemersvariant",
                value: json['OPNAME_AANNEMERSVARIANT']

            });

            data.push({
                status: "Schade-opnemers",
                value: json['OPNAMES_OPNEMERSVARIANT']

            });

            data.push({
                status: "CVW 2000",
                value: json['OPNAMES_CVW2000']

            });

            data.push({
                status: "Wooncorporaties",
                value: json['OPNAMES_WOCO']

            });

            data.push({
                status: "Regulier",
                value: json['OPNAMES_REGULIER'] + json['OPNAMES_SMR']

            });
            
            return data;
        }

        function legend(data,filter) {

            let legendX = 360;
            let legendY = 120;

            if(smallMultiple) {

               legendX = 110;
               legendY = 30;
            }

            if (window.innerWidth < 640) {

                legendX = 300;
                legendY = 120;

            }

            if (window.innerWidth < 480) {

                legendX = 120;
                legendY = 110;

            }



            // if (window.innerWidth < 640) {

            svg.layers.legend
                .attr('transform', 'translate(' + legendX + ',' + legendY + ')');

                svg.layers.legend.selectAll('*')
                    .remove();

                data.forEach( (d,i) => {

                    svg.layers.legend.append("rect")
                        .attr("y", (i * 20) - 8)
                        .attr("height",12)
                        .attr("width",12)
                        .attr("fill", config.colours(i))
                        .style("opacity", 1);

                    svg.layers.legend.append("text")
                        .attr("class", "small-label")
                        .attr("dy", (i * 20) + 2)
                        .attr("dx",16)
                        .text(d['status'] + ':')
                        .attr("width", dimensions.svgWidth)
                        .style("opacity", 1);

                    svg.layers.legend.append("text")
                        .attr("class", "small-label")
                        .attr("dx", 200)
                        .attr("dy", (i * 20) + 2)
                        .text(d['value'])
                        .attr("width", dimensions.svgWidth)
                        .style("opacity", 1)
                        .style("text-anchor", "end");

                });


            svg.layers.legend.append("rect")
                .attr("class", "small-label")
                .attr("y", ((data.length - 1) * 20) + 8)
                .attr("height",.5)
                .attr("width",200)
                .style("opacity", 1)
                .style("fill","black");

            svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dy", (data.length * 20) + 2)
                .text('Totaal:')
                .attr("width",dimensions.svgWidth)
                .style("opacity", 1);

            svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dx", 200)
                .attr("dy", (data.length * 20) + 2)
                .text(json.filter( j => j['_category'] === filter)[0]['OPNAMES'])
                .attr("width",dimensions.svgWidth)
                .style("opacity", 1)
                .style("text-anchor", "end");

            // }
        }

        function draw(data) {

            console.log(data.length);

            chartPie.draw(data);
        }

        function redraw() {

            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);
            chartPie.redraw(dimensions,smallMultiple);
        }

        function run(json,filter) {
            let data = prepareData(json,filter);
            draw(data);
            redraw();
          //  totalElement.innerText = convertToCurrency(json.filter( j => j['_category'] === filter)[0]['TOTAAL_VERLEEND']);
            legend(data,filter);

        }

        run(json,'all');

        window.addEventListener("resize", redraw, false);

        if(municipalitySelect != null) {
            municipalitySelect.addEventListener("change", function () {
                run(json,municipalitySelect.options[municipalitySelect.selectedIndex].value);
            });
        }
    });
}