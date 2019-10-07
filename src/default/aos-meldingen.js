var aosMeldingen = function(element,smallMultiple) {

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
    config.margin.left = 30;
    config.margin.right = 0;
    config.padding.top = 15;
    config.padding.bottom = 15;
    config.padding.left = 30;
    config.padding.right = 0;
    // name of first column with values of bands on x axis


  //  config.yParameter = 'meldingen';  // is being set in type function
    // config.fixedHeight = 160;
    config.minValue = 30000;
  //  config.maxValue = 30000;


    config.xParameter = '_date';
   // config.minWidth = 460;

    config.paddingInner = 0;
    config.paddingOuter = .1;

    if(smallMultiple) {
        config.dataArrayLength = 4;
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

    d3.json(url, function(error, json) {
        if (error) throw error;


        // remove data entry from wednesday
       let data = json.reverse();


       if(config.dataArrayLength) {
           data = data.slice(data.length - config.dataArrayLength,data.length);
       } else if (window.innerWidth < 600) {
            data = data.slice(data.length - 3,data.length);
        } else if (window.innerWidth < 1200) {
            data = data.slice(data.length - 6,data.length);
        } else {
            data = data.slice(data.length - 12,data.length);
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

        function update(property) {

            xScale = chartXScale.set(data);
            yScale = chartYScale.set(data,property);
            chartBarsIncrease.draw(data,colours,property);
            redraw(property);
        }

        let property = 'aos_meldingen';
        update(property);

        window.addEventListener("resize", function() { redraw(property) }, false);

        for (let radio of radios) {
            radio.addEventListener( 'click', () => {
                update(radio.value);
                // document.querySelector('h2').innerText = radio.value.replace('_',' ');
            },false)
        }

    });
}