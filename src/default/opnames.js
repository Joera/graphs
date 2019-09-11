var opnames = function(element) {

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

    let colours = ['green','blue','orange','darkblue'];

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

    let options = [].slice.call(document.querySelectorAll('.selector li input[type=checkbox]'));

    d3.json(url, function(error, json) {
        if (error) throw error;


        // remove data entry from wednesday
        let data = json.slice(1).reverse();

        let propertyArray = ['opnames'];

        function filterData(array) {

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
            chartStackedBars.redraw(dimensions,xScale,yScale);

        }

        function update(propertyArray) {

            let stackedData = filterData(propertyArray);
            xScale = chartXScale.set(data);
            yScale = chartYScale.set(stackedData);
            chartStackedBars.draw(data,stackedData,colours);
            //  chartLegend.drawDefault(dimensions);
            // further drawing happens in function that can be repeated.
            redraw();
        }

        update(propertyArray);
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
                update(propertyArray);
            }, false)
        }
    });
}