var bedragen = function(element) {

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
    config.margin.left = 40;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 50;
    config.padding.left = 30;
    config.padding.right = 0;
    config.xParameter = 'status';  // name of first column with values of bands on x axis
    config.yParameter = 'totaal';  // is being set in type function
    config.currencyLabels = true;
    // config.fixedHeight = 160;
    config.minValue = 0;
    // config.maxValue = 6000;
    // config.xAlign = [0.5];
    config.paddingInner = [0.5];
    config.paddingOuter = [0.5];

    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element,config,dimensions,svg);
    let chartXScale = new ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config,svg);

    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    let chartBar = ChartBar(config,svg,functions);

    let url = 'https://tcmg-hub.publikaan.nl/api/gemeentes';

    d3.json(url, function(error, json) {

        function prepareData(json,filter) {

            json = json.filter( j => j['_category'] === filter)[0];

            let data = [];

            data.push({
                abbrev: "1",
                status: "Vergoeding mijnbouwschade",
                totaal: json['BEDRAG_SCHADEBEDRAG']

            });

            data.push({
                abbrev: "2",
                status: "Stuwmeerregeling",
                totaal: json['BEDRAG_SMR']

            });

            data.push({
                abbrev: "3",
                status: "Vergoeding overige schades",
                totaal: json['BEDRAG_GEVOLGSCHADE']

            });

            data.push({
                abbrev: "4",
                status: "Bijkomende kosten",
                totaal: json['BEDRAG_BIJKOMENDE_KOSTEN']

            });

            data.push({
                abbrev: "5",
                status: "Wettelijke rente",
                totaal: json['BEDRAG_WETTELIJKE_RENTE']

            });

            return data;
        }

        function legend(data) {

            if (window.innerWidth < 640) {

                data.forEach( (d,i) => {

                    let text  = (i + 1) + '. ' + d[config.xParameter] + ' ';

                    svg.layers.legend.append("text")
                        .attr("class", "small-label")
                        .attr("dy", i * 20)
                        .text(text)
                        .attr("width",dimensions.svgWidth)
                        .style("opacity", 1);
                });
            }
        }

        function draw(data) {
            // with data we can init scales
            xScale = chartXScale.set(data);
            yScale = chartYScale.set(data,config.yParameter);

            // width data we can draw items
            chartBar.draw(data, colours);
        }

        function redraw() {
            // on redraw chart gets new dimensions
            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);
            // new dimensions mean new scales
            xScale = chartXScale.reset(dimensions,xScale);
            yScale = chartYScale.reset(dimensions,yScale);
            // new scales mean new axis
            chartAxis.redrawXBandAxis(dimensions,xScale,axes,true);
            chartAxis.redrawYAxis(yScale,axes);
            // redraw data
            chartBar.redraw(dimensions,xScale,yScale);
        }

        function run(json,filter) {
            let data = prepareData(json,filter);
            draw(data);
            redraw();
            totalElement.innerText = convertToCurrency(json.filter( j => j['_category'] === filter)[0]['TOTAAL_VERLEEND']);
            legend(data);

        }

        run(json,'all');

        window.addEventListener("resize", redraw, false);
    });
}