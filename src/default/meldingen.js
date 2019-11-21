var meldingen = function(elementID,dataMapping,property,smallMultiple) {

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
    config.margin.bottom = 0;
    config.margin.left = 40;
    config.margin.right = 0;
    config.padding.top = 10;
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

    let colours = dataMapping.map( (p) => p.colour);

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(elementID,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(elementID,config,dimensions,svg);
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

        let neededColumns = ['_date','_category'];

        neededColumns.push(dataMapping.map( (c) => c.column ));

        console.log(neededColumns);

        let data = json.filter( (i) => {

            console.log(i);

            return;

        }).sort(function(a, b) {
            return new Date(a._date) - new Date(b._date);
        });

        let minBarWidth = 50;

        let elWidth = d3.select(elementID).node().getBoundingClientRect().width;

        data = data.slice(data.length - Math.floor(elWidth / minBarWidth),data.length);

        // if(config.dataArrayLength) {
        //     data = data.slice(data.length - config.dataArrayLength,data.length);
        // } else if (window.innerWidth < 600) {
        //     data = data.slice(data.length - 5,data.length);
        // } else if (window.innerWidth < 1200) {
        //     data = data.slice(data.length - 9,data.length);
        // } else {
        //     data = data.slice(data.length - 16,data.length);
        // }

        return data;
    }


    function redraw(data,property) {

        yScale = chartYScale.set(data,property);

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

        chartBarsIncrease.draw(data,colours,property);
    }

    function run(json) {

        let data = prepareData(json,property);
        draw(data);
        redraw(data,property);
        // legend(data);

        window.addEventListener("resize", () => redraw(data,property), false);

        for (let radio of radios) {
            radio.addEventListener( 'change', () => redraw(data,radio.value),false);
        }
    }

    if (globalData.weeks) {

        run(globalData.weeks)

    } else {

        d3.json(url, function(error, json) {
            if (error) throw error;
            globalData.weeks = json;
            run(json);
        });
    }



}