var meldingen = function(element,smallMultiple,property) {

    // if(typeof element === 'string') {
    //     console.log('hi');
    //     element = document.getElementById(element)
    //     console.log(element);
    // }

    let radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let xScale = chartObjects.xScale();
    let yScale = chartObjects.yScale();
    let axes = chartObjects.axes();
    let functions = chartObjects.functions();

    config.margin.top = 0;
    config.margin.bottom = 30;
    config.margin.left = 40;
    config.margin.right = 0;
    config.padding.top = 15;
    config.padding.bottom = 15;
    config.padding.left = 30;
    config.padding.right = 0;

    config.minValue = 26000;

    config.xParameter = '_date';

    config.paddingInner = 0;
    config.paddingOuter = 0;

    if(smallMultiple) {
        config.dataArrayLength = 7;
    }

    let colours = ['green','orange'];

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element,config,dimensions,svg);
    let chartXScale =  new ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config,svg);
    let chartBarsIncrease = ChartBarsIncrease(config,svg);
    let chartLegend = ChartLegend(config,svg);

    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    let url = 'https://tcmg-hub.publikaan.nl/api/data';
    if (!property) { property = 'schademeldingen' }

    function prepareData(json,property)  {

        let data = json.reverse();

        if(config.dataArrayLength) {
            data = data.slice(data.length - config.dataArrayLength,data.length);
        } else if (window.innerWidth < 600) {
            data = data.slice(data.length - 5,data.length);
        } else if (window.innerWidth < 1200) {
            data = data.slice(data.length - 9,data.length);
        } else {
            data = data.slice(data.length - 16,data.length);
        }

        return data;
    }


    function redraw(property) {
        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);
        // new dimensions mean new scales
        xScale = chartXScale.reset(dimensions,xScale);
        yScale = chartYScale.reset(dimensions,yScale);
        // new scales mean new axis

        chartAxis.redrawXTimeAxis(dimensions,xScale,axes,false);
        chartAxis.redrawYAxis(yScale,axes);
        // redraw data
        chartBarsIncrease.redraw(dimensions,xScale,yScale,property);
    }

    function draw(data) {

        xScale = chartXScale.set(data.map(d => d[config.xParameter]));
        yScale = chartYScale.set(data,property);
        chartBarsIncrease.draw(data,colours,property);
    }

    function run(json) {

        let data = prepareData(json,property);
        draw(data);
        redraw(property);
        // legend(data);
    }

    if (globalData.weeks) {

        // run(globalData.weeks)

    } else {

        d3.json(url, function(error, json) {
            if (error) throw error;
            globalData.weeks = json;
            // run(json);
        });
    }

    window.addEventListener("resize", () => redraw(property), false);

    for (let radio of radios) {
        radio.addEventListener( 'change', () => redraw(radio.value),false);
    }

}