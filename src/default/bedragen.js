var bedragen = function(element) {

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
    config.padding.bottom = 30;
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

    let url = 'https://tcmg.publikaan.nl/api/schadevergoedingen?week=recent';

    d3.json(url, function(error, json) {

        function prepareData(json,filter) {

            json = json.filter( j => j['_category'] === filter)[0];

            let data = [];

            // data.push({
            //     status: "Afgewezen",
            //     totaal: json[0][filter]
            //
            // });

            data.push({
                status: "Vergoeding mijnbouwschade",
                totaal: json['BEDRAG_SCHADEBEDRAG']

            });

            data.push({
                status: "Stuwmeerregeling",
                totaal: json['BEDRAG_STUWMEER']

            });

            data.push({
                status: "Vergoeding overige schades",
                totaal: json['BEDRAG_GEVOLGSCHADE']

            });

            data.push({
                status: "Bijkomende kosten",
                totaal: json['BEDRAG_BK']

            });

            data.push({
                status: "Wettelijke rente",
                totaal: json['BEDRAG_WR']

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
            chartAxis.redrawXBandAxis(dimensions,xScale,axes);
            chartAxis.redrawYAxis(yScale,axes);
            // redraw data
            chartBar.redraw(dimensions,xScale,yScale);
        }

        function run(json,filter) {
            let data = prepareData(json,filter);
            draw(data);
            redraw();
        }

        run(json,'all');

        window.addEventListener("resize", redraw, false);
    });
}