var meldingen = function(element) {

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let scales = chartObjects.scales();
    let axes = chartObjects.axes();
    let functions = chartObjects.functions();

    config.margin.top = 0;
    config.margin.bottom = 0;
    config.margin.left = 0;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 30;
    config.padding.left = 40;
    config.padding.right = 0;
    // name of first column with values of bands on x axis


    config.yParameter = 'meldingen';  // is being set in type function
    // config.fixedHeight = 160;
    config.minValue = 15000;
  //  config.maxValue = 30000;


    config.xParameter = '_date';
   // config.minWidth = 460;

    let colours = ['green','blue'];

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element,config,dimensions,svg);
    let chartScales = ChartScales(config,dimensions,scales);
    let chartAxis = ChartAxis(config,svg);
    let chartStackedBars = ChartStackedBars(config,svg);

    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    let url = 'https://tcmg.publikaan.nl/api/meldingen';

    d3.json(url, function(error, json) {
        if (error) throw error;


        // remove data entry from wednesday
       let data = json.slice(1);

        functions.stack = d3.stack()
            .keys(Object.keys(data[0]).filter(key => ['meldingen','nieuwe_meldingen'].indexOf(key) > -1));

        let stackedData = functions.stack(data);

        function redraw() {
            // on redraw chart gets new dimensions
            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);
            // new dimensions mean new scales
            scales = chartScales.reset(dimensions,scales);
            // new scales mean new axis

            chartAxis.redrawXTimeAxis(dimensions,scales,axes,false);
            chartAxis.redrawYAxis(scales,axes);
            // redraw data
            chartStackedBars.redraw(dimensions,scales);

        }

        scales = chartScales.set(data);
        chartStackedBars.draw(data,stackedData,colours);
        // further drawing happens in function that can be repeated.
        redraw();
        // for example on window resize
        window.addEventListener("resize", redraw, false);

    });
}