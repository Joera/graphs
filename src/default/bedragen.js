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
    config.margin.bottom = 0;
    config.margin.left = 30;
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
    let chartXScale = ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config,svg);

    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    let chartBar = ChartBar(config,svg,functions);

    let url = 'https://tcmg.publikaan.nl/api/gemeentes';

    d3.json(url, function(error, json) {

        function prepareData(json,filter) {

            console.log(json);

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

        }

        run(json,'all');

        window.addEventListener("resize", redraw, false);

        if (window.innerWidth < 640) {

            let text ='';

            data.forEach( (d,i) => {

                text  += i + '. ' + d[config.xParameters];
            }


            svg.layers.legend.append("text")
                .attr("class", "small-label")
                .text(text)
                .attr("width",dimensions.containerWidth)
                .style("opacity", 1);

        }
    });
}