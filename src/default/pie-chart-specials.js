var pieChartSpecials = function(element,smallMultiple) {

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
        .range([green,orange]);

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
                status: "Afgehandelde specials",
                value: json['SPECIALS_AFGEHANDELD_TOTAAL']

            });

            data.push({
                status: "Specials in behandeling",
                value: json['SPECIALS_WERKVOORRAAD_IN_BEH']

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
                        .attr("width", dimensions.containerWidth)
                        .style("opacity", 1);

                    svg.layers.legend.append("text")
                        .attr("class", "small-label")
                        .attr("dx", 200)
                        .attr("dy", (i * 20) + 2)
                        .text(d['value'])
                        .attr("width", dimensions.containerWidth)
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
                .attr("width",dimensions.containerWidth)
                .style("opacity", 1);

            svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dx", 200)
                .attr("dy", (data.length * 20) + 2)
                .text(json.filter( j => j['_category'] === filter)[0]['SPECIALS_MELDINGEN'])
                .attr("width",dimensions.containerWidth)
                .style("opacity", 1)
                .style("text-anchor", "end");

            // }
        }

        function muniDropdown(munis) {

            let option = document.createElement('option');
            option.value = 'all';
            option.innerText = 'Alle gemeenten';
            option.selected = true;
            municipalitySelect.appendChild(option);

            munis.forEach( (m) => {

                if(m['_category'] !== 'all' && m['_category'] !== '' &&
                    m['SPECIALS_MELDINGEN'] > 24 && m['SPECIALS_WERKVOORRAAD_IN_BEH'] > 24 && m['SPECIALS_AFGEHANDELD_TOTAAL'] > 24
                ) {
                    option = document.createElement('option');
                    option.value = m['_category'];
                    option.innerText = m['GEMEENTE'];
                    municipalitySelect.appendChild(option)
                }

            })
        }

        function draw(data) {
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

        muniDropdown(json);
        run(json,'all');

        window.addEventListener("resize", redraw, false);

        if(municipalitySelect != null) {
            municipalitySelect.addEventListener("change", function () {
                run(json,municipalitySelect.options[municipalitySelect.selectedIndex].value);
            });
        }
    });
}