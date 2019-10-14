var voortgangDetails = function(element,smallMultiple) {


    let options = [].slice.call(document.querySelectorAll('.selector li input[type=checkbox]'));

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
    config.padding.top = smallMultiple ? 15 : 30;
    config.padding.bottom = 30;
    config.padding.left = 30;
    config.padding.right = 0;
    // name of first column with values of bands on x axis


    config.yParameter = 'behandeling';  // is being set in type function
    // config.fixedHeight = 160;
    config.minValue = 0;
    // config.maxValue = 60000;


    config.xParameter = '_date';

    let colours = {

        'MELDING_CVW': blue,
        'MELDING_VOOR_WESTERWIJTWE': darkblue,
        'MELDING_NA_WESTERWIJTWERD': orange,
        'AFGEHANDELD_TOTAAL': green,
    }

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element,config,dimensions,svg);
    let chartXScale = new ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config,svg);
    let chartStackedArea = ChartStackedArea(config,svg,functions);

    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    let url = 'https://tcmg-hub.publikaan.nl/api/data';

    d3.json(url, function(error, json) {
        if (error) throw error;

        //       let neededColumns = ['date','aos','besluiten','inbehandeling','meldingen','opnames'];

        let neededColumns = ['MELDING_CVW','MELDING_VOOR_WESTERWIJTWE','MELDING_NA_WESTERWIJTWERD','AFGEHANDELD_TOTAAL','_date'];

        let data = trimColumns(json,neededColumns);

        data = hasValue(data,'MELDING_CVW');

        let propertyArray = ['MELDING_CVW','MELDING_VOOR_WESTERWIJTWE','MELDING_NA_WESTERWIJTWERD','AFGEHANDELD_TOTAAL'];
        let stackedData = filterData(propertyArray);

        function filterData(array) {
            //
            console.log(array);

            functions.stack = d3.stack()
                .keys(Object.keys(data[data.length - 1]).filter(key => array.indexOf(key) > -1));

            return functions.stack(data);
        }

        function legend() {

            console.log(data);

            options.forEach( () => {

                console.log(option.nextElementSibling.innerText);

            })
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
            chartAxis.redrawYAxisStacked(yScale,axes);
            // redraw data
            chartStackedArea.redraw(dimensions,xScale,yScale,colours);

        }

        function update(propertyArray) {

            stackedData = filterData(propertyArray);
            xScale = chartXScale.set(data);
            yScale = chartYScale.set(stackedData,config.yParameter);
            chartStackedArea.draw(stackedData,colours);
            redraw();
        }


        chartStackedArea.init(stackedData);
        update(propertyArray);
        legend();

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