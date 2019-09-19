var bedragen = function(element) {

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
    // name of first column with values of bands on x axis
    // is being set in type function

    // y-scale
    config.yParameter = 'Totaal';
    config.minValue = 0;
    config.maxValue = 10000;
    // x-scale
    config.fixedWidth = 100 + 6;
    config.xParameter = 'Uitkomst';

    config.paddingInner = [0.0];
    config.paddingOuter = [0.0];

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element,config,dimensions,svg);
    let chartXScale = ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config,svg);
    let chartBlocks = ChartBlocks(config,svg,functions);

    chartAxis.drawBlocksYAxis(dimensions);

    let url = 'https://tcmg.publikaan.nl/api/schadevergoedingen?week=recent';

    d3.json(url, function(error, json) {
        if (error) throw error;

        let data = [];

        function prepareData(json) {

            json = json.filter( j => j['_category'] === filter)[0];

            data = [];

            // data.push({
            //     status: "Afgewezen",
            //     totaal: json[0][filter]
            //
            // });

            data.push({
                status: "Schadebedrag",
                totaal: json[0]['SCHADEBEDRAG']

            });

            data.push({
                status: "Wettelijke rente",
                totaal: json['AANTAL_WETTELIJKE_RENTE']

            });

            data.push({
                status: "€4K t/m €10K",
                totaal: json['BIJKOMENDE_KOSTEN']

            });

            data.push({
                status: "> €10K",
                totaal: json['MEER_DAN_10000']

            });

            return data;
        }


        function draw() {

            xScale = chartXScale.set(data);
            yScale = chartYScale.set(data,config.yParameter);

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
            //  chartAxis.redrawXAxis(dimensions,scales,axes);
            chartAxis.redrawBlocksYAxis(scales,axes);
            // redraw data
            chartBlocks.redraw(dimensions, scales);
        }

        function run(json) {
            data = prepareData(json);
            draw(data);
            redraw();
        }

        run(json);

        // for example on window resize
        window.addEventListener("resize", redraw, false);
    });
}