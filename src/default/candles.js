var candles = function(element,smallMultiple) {

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let xScale = chartObjects.xScale();
    let yScale = chartObjects.yScale();
    let axes = chartObjects.axes();
    let functions = chartObjects.functions();

    config.padding.top = smallMultiple? 15 : 30;
    config.padding.bottom = 30;
    config.padding.left = 40;

    // name of first column with values of bands on x axis


    config.yParameter = 'in_behandeling';  // is being set in type function
    // config.fixedHeight = 160;
    config.minValue = 13000;
    // config.maxValue = 17000;


    config.xParameter = '_date';
    config.xScaleTicks = 'timeMonth';
    // config.minWidth = 460;
    // get dimensions from parent element
    let chartDimensions = new ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = new ChartSVG(element,config,dimensions,svg);
    let chartXScale = new ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config,svg);
    let chartLine = ChartCandles(config,svg,functions,dimensions);
    //   let chartStackedArea = ChartStackedArea(config,svg,functions);

    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    let url = 'https://tcmg-hub.publikaan.nl/api/data';

    d3.json(url, function(error, json) {
        if (error) throw error;

        let neededColumns = ['schademeldingen','afgehandeld','in_behandeling','nieuwe_schademeldingen','nieuwe_afgehandeld','_date'];
        let data = trimColumns(json,neededColumns);

        data = hasValue(data,'nieuwe_schademeldingen');

        data = data.slice(0,data.length - 2);

        // data.forEach( (week,i) => {
        //
        //     if (i > 1) {
        //         week.increase = data[i]['schademeldingen'] - data[i - 1]['schademeldingen'];
        //         week.decrease = data[i]['afgehandeld'] - data[i - 1]['afgehandeld'];
        //     } else {
        //         week.increase = 0;
        //         week.decrease = 0;
        //     }
        // });


        function draw() {

            xScale = chartXScale.set(data.map( (d) => d['_date']));
            yScale = chartYScale.set(data,config.yParameter);
            chartLine.draw(data);

        }

        function redraw() {
            // on redraw chart gets new dimensions
            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);
            // new dimensions mean new scales
            xScale = chartXScale.reset(dimensions,xScale);
            yScale = chartYScale.reset(dimensions,yScale);
            // new scales mean new axis
            chartAxis.redrawXTimeAxis(dimensions,xScale,axes,true);
            chartAxis.redrawYAxis(yScale,axes);
            // redraw data
            chartLine.redraw(xScale,yScale,functions,dimensions,data);
        }


        // further drawing happens in function that can be repeated.
        draw();
        redraw();
        // for example on window resize
        window.addEventListener("resize", redraw, false);

    });
}