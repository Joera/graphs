var uitbetalingen = function(element) {

    let colours = ['green','green','green','green'];

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
    config.margin.left = 0;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 30;
    config.padding.left = 60;
    config.padding.right = 0;
    config.xParameter = 'status';  // name of first column with values of bands on x axis
    config.yParameter = 'totaal';  // is being set in type function
    config.fixedHeight = 160;
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

        console.log(json);

        function prepareData(json,filter) {

            json = json.filter( j => j['CATEGORY'] === filter)[0];

            let data = [];

            // data.push({
            //     status: "Afgewezen",
            //     totaal: json[0][filter]
            //
            // });

            data.push({
                status: "< €1K",
                totaal: json['0_1000']

            });

            data.push({
                status: "€1K t/m €4K",
                totaal: json['1000_4000']

            });

            data.push({
                status: "€4K t/m €10K",
                totaal: json['4000_10000']

            });

            data.push({
                status: "> €10K",
                totaal: json['MEER_DAN_10000']

            });

            // data.columns = csv.columns;

            return data;
        }

        function draw(data) {

            // with data we can init scales
            xScale = chartXScale.set(data);
            yScale = chartYScale.set(stackedData);

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
            chartAxis.redrawXBandAxis(dimensions,scales,axes);
            chartAxis.redrawYAxis(scales,axes);
            // redraw data
            chartBar.redraw(dimensions,scales);
        }

        function run(json,filter) {
            let data = prepareData(json,filter);
            draw(data);
            redraw();
        }

        run(json,'all');

        window.addEventListener("resize", redraw, false);
    });

    // for example on window resize


    // procedureSelect.addEventListener("change", function() {
    //     run(procedureSelect.options[procedureSelect.selectedIndex].value);
    // });

}