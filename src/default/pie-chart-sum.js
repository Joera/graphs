var pieChartSum = function(element) {

    let totalElement = document.querySelector('h3    span');

    let colours = ['green','green','green','green','green'];

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let xScale = chartObjects.xScale();
    let yScale = chartObjects.yScale();
    let axes = chartObjects.axes();
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
        .range([green,darkblue,blue,orange]);

    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element,config,dimensions,svg);

    let chartPie = ChartPie(config,svg,functions);

    let url = 'https://tcmg.publikaan.nl/api/gemeentes';

    d3.json(url, function(error, json) {

        function prepareData(json,filter) {

            json = json.filter( j => j['_category'] === filter)[0];

            let data = [];

            data.push({
                status: "Vergoeding mijnbouwschade",
                totaal: json['BEDRAG_SCHADEBEDRAG']

            });

            data.push({
                status: "Stuwmeerregeling",
                totaal: json['BEDRAG_SMR']

            });

            data.push({
                status: "Vergoeding overige schades",
                totaal: json['BEDRAG_GEVOLGSCHADE']

            });

            data.push({
                status: "Bijkomende kosten",
                totaal: json['BEDRAG_BIJKOMENDE_KOSTEN']

            });

            data.push({
                status: "Wettelijke rente",
                totaal: json['BEDRAG_WETTELIJKE_RENTE']

            });

            console.log(data);

            return data;
        }

        function legend(data) {

            // if (window.innerWidth < 640) {

            svg.layers.legend
                .attr('transform', 'translate(' + (dimensions.containerWidth / 2) + ',' + (dimensions.containerHeight / 2) + ')');

                data.forEach( (d,i) => {

                    let text  = d['status'] + ': ' + convertToCurrency(d['totaal']);

                    svg.layers.legend.append("rect")
                        .attr("class", "small-label")
                        .attr("y", ((data.length - 1) * 20) + 7)
                        .attr("height",1)
                        .attr("width",300)
                        .style("opacity", 1)
                        .style("fill","black");

                    svg.layers.legend.append("text")
                        .attr("class", "small-label")
                        .attr("dy", i * 20)
                        .text(text)
                        .attr("width",dimensions.containerWidth)
                        .style("opacity", 1);
                });

            svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dy", data.length * 20)
                .text('Totaal:')
                .attr("width",dimensions.containerWidth)
                .style("opacity", 1);

            // }
        }

        function draw(data) {
            chartPie.draw(data);
        }

        function redraw() {

            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);
            chartPie.redraw(dimensions);
        }

        function run(json,filter) {
            let data = prepareData(json,filter);
            draw(data);
            redraw();
          //  totalElement.innerText = convertToCurrency(json.filter( j => j['_category'] === filter)[0]['TOTAAL_VERLEEND']);
            legend(data);

        }

        run(json,'all');

        window.addEventListener("resize", redraw, false);
    });
}