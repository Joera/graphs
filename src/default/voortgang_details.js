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

    config.padding.left = 40;

    config.padding.top = 15;
    config.margin.bottom = 30;

    // name of first column with values of bands on x axis

    config.yParameter = 'behandeling';  // is being set in type function
    // config.fixedHeight = 160;
    config.minValue = 0;
    // config.maxValue = 60000;
    config.xParameter = '_date';
    config.xScaleTicks = 'timeMonth';

    let colours = {

        'MELDING_CVW': blue,
        'MELDING_VOOR_WESTERWIJTWE': darkblue,
        'MELDING_NA_WESTERWIJTWERD': orange,
        'AFGEHANDELD_TOTAAL': green,
        'WERKVOORRAAD_IN_BEHANDELING': orange
    }

    // get dimensions from parent element
    let chartDimensions = new ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = new ChartSVG(element,config,dimensions,svg);
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

        let neededColumns = ['MELDING_CVW','MELDING_VOOR_WESTERWIJTWE','MELDING_NA_WESTERWIJTWERD','WERKVOORRAAD_IN_BEHANDELING','AFGEHANDELD_TOTAAL','_date'];

        let data = trimColumnsAndOrder(json,neededColumns);

            data = hasValue(data,'MELDING_CVW');

        let propertyArray = ['MELDING_CVW','MELDING_VOOR_WESTERWIJTWE','MELDING_NA_WESTERWIJTWERD','AFGEHANDELD_TOTAAL'];
        let stackedData = filterData(propertyArray);

        function setCheckboxes(propertyArray) {

            options.forEach( (option) => {

                option.checked = false;

                if (propertyArray.indexOf(option.id) > -1) {
                    option.checked = true;
                }
            })
        }

        function filterData(array) {

            functions.stack = d3.stack()
                .keys(Object.keys(data[data.length - 1]).filter(key => array.indexOf(key) > -1));

            return functions.stack(data);
        }

        function legend() {
            options.forEach( (option) => {
                option.nextElementSibling.innerText += ': ' + data[0][option.id];
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
            xScale = chartXScale.set(data.map( (d) => d['_date'] ));
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

                    if (option.value === 'WERKVOORRAAD_IN_BEHANDELING' ) {
                        propertyArray = ['AFGEHANDELD_TOTAAL','WERKVOORRAAD_IN_BEHANDELING'];
                        setCheckboxes(propertyArray);
                    } else if (propertyArray.indexOf('WERKVOORRAAD_IN_BEHANDELING') > -1) {
                        propertyArray = ['MELDING_CVW','MELDING_VOOR_WESTERWIJTWE','MELDING_NA_WESTERWIJTWERD','AFGEHANDELD_TOTAAL'];
                        setCheckboxes(propertyArray);
                    }

                } else {
                    let index = propertyArray.indexOf(option.value);
                    propertyArray.splice(index,1);

                    if (option.value === 'WERKVOORRAAD_IN_BEHANDELING' ) {
                        propertyArray = ['MELDING_CVW','MELDING_VOOR_WESTERWIJTWE','MELDING_NA_WESTERWIJTWERD','AFGEHANDELD_TOTAAL'];
                        setCheckboxes(propertyArray);
                    }
                }

                update(propertyArray);

            }, false)
        }

    });
}