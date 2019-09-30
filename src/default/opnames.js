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

    config.noTicksYAxis = true;

    let colours = {

        'schadeopnames': 'green',
        'nulmetingen': 'orange',
        'besluiten_regulier': 'blue',
        'besluiten_stuwmeerregeling': 'darkblue',
        'nieuwe_schadeopnames': 'green',
        'nieuwe_nulmetingen': 'orange',
        'nieuwe_besluiten_regulier': 'blue',
        'nieuwe_besluiten_stuwmeerregeling': 'darkblue'
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

    let url = 'https://tcmg.publikaan.nl/api/data';

    d3.json(url, function(error, json) {
        if (error) throw error;

        let data = json.reverse();

        if (window.innerWidth < 600) {
            data = data.slice(data.length - 3,data.length);
        } else if (window.innerWidth < 1200) {
            data = data.slice(data.length - 10,data.length);
        } else {
            data = data.slice(data.length - 20,data.length);
        }

        let propertyArray = ['schadeopnames'];
        let increments = false;

        function filterData(array,increments) {
            //
            // console.log(array);

            if(increments) {
                for (let i = 0; i < array.length; i++) {
                    array[i] = (array[i].slice(0,7) !== 'nieuwe_') ? 'nieuwe_' + array[i] : array[i];
                }
            } else {
                for (let i = 0; i < array.length; i++) {
                    array[i] = (array[i].slice(0,7) === 'nieuwe_') ? array[i].slice(7,array[i].length) : array[i];
                }
            }



            functions.stack = d3.stack()
                .keys(Object.keys(data[data.length - 1]).filter(key => array.indexOf(key) > -1));
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
            xScale = chartXScale.set(data);
            yScale = chartYScale.set(stackedData);
            chartStackedBars.draw(data,stackedData,colours);
            redraw();
        }

        update(propertyArray,increments);
        // for example on window resize
        window.addEventListener("resize", redraw, false);

        for (let option of options) {
            option.addEventListener( 'click', () => {

                if(increments) option.value = 'nieuwe_' + option.value;


                if (option.checked) {
                    propertyArray[propertyArray.length] = option.value;
                } else {
                    console.log(propertyArray);
                    console.log(option.value);
                    let index = propertyArray.indexOf(option.value);
                    console.log(index);
                    propertyArray.splice(index,1);
                }



                update(propertyArray,increments);
            }, false)
        }

        for (let radio of radios) {

            radio.addEventListener( 'change', () => {
                increments = !increments;
                update(propertyArray,increments)
            }, false)
        }
    });
}