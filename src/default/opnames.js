var opnames = function(element) {

    let options = [].slice.call(document.querySelectorAll('.selector li input[type=checkbox]'));
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
    config.margin.left = 30;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 30;
    config.padding.left = 0;
    config.padding.right = 0;
    // name of first column with values of bands on x axis


     // is being set in type function
    // config.fixedHeight = 160;
    config.minValue = 0; // 18000;
    //  config.maxValue = 30000;

    config.xParameter = '_date';
    config.yParameter = 'opnames';
    // config.minWidth = 460;
    //
    config.paddingInner = 3;
    config.paddingOuter = 6;

    let colours = {

        'opnames': 'green',
        'nul-metingen': 'blue',
        'adviesrapporten': 'orange',
        'besluiten': 'darkblue'
    }

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element,config,dimensions,svg);
    let chartXScale = ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config,svg);
    let chartStackedBars = ChartStackedBars(config,svg);
    let chartLegend = ChartLegend(config,svg);

    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    let url = 'https://tcmg.publikaan.nl/api/procedure';

    d3.json(url, function(error, json) {
        if (error) throw error;

        let data = json.reverse();

        let propertyArray = ['opnames'];
        let increments = false;

        function filterData(array,increments) {

            if(increments) {
                for (let i = 0; i < array.length; i++) {
                    array[i] = (array[i].slice(0,7) !== 'nieuwe_') ? 'nieuwe_' + array[i] : array[i];
                }
            } else {
                for (let i = 0; i < array.length; i++) {
                    array[i] = (array[i].slice(0,7) === 'nieuwe_') ? array[i].slice(7,array[i].length) : array[i];
                }
            }

            console.log(array);
            console.log(data[0]);

            functions.stack = d3.stack()
                .keys(Object.keys(data[0]).filter(key => array.indexOf(key) > -1));
            return functions.stack(data);
        }

        function redraw() {
            // on redraw chart gets new dimensions
            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);
            // new dimensions mean new scales
            xScale = chartXScale.reset(dimensions,xScale);
            yScale = chartYScale.reset(dimensions,yScale);
            // new scales mean new axis

            chartAxis.redrawXTimeAxis(dimensions,xScale,axes,false);
            chartAxis.redrawYAxisStacked(yScale,axes);
            // redraw data
            chartStackedBars.redraw(dimensions,xScale,yScale,colours);

        }

        function update(propertyArray,increments) {

            let stackedData = filterData(propertyArray,increments);
            console.log(stackedData);
            xScale = chartXScale.set(data);
            yScale = chartYScale.set(stackedData);
            chartStackedBars.draw(data,stackedData,colours);
            //  chartLegend.drawDefault(dimensions);
            // further drawing happens in function that can be repeated.
            redraw();
        }

        update(propertyArray,increments);
        // for example on window resize
        window.addEventListener("resize", redraw, false);

        for (let option of options) {
            option.addEventListener( 'click', () => {
                if (option.checked) {
                    propertyArray[propertyArray.length] = option.value;
                } else {
                    let index = propertyArray.indexOf(option.value);
                    propertyArray.splice(index,1);
                }
                update(propertyArray,increments);
            }, false)
        }

        for (let radio of radios) {

            radio.addEventListener( 'click', () => {
                increments = !increments;
                update(propertyArray,increments)
            }, false)
        }
    });
}