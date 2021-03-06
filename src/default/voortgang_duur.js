var voortgangDuur = function(api,element,dataMapping,smallMultiple,property) {


    let options = [].slice.call(document.querySelectorAll('.selector li input[type=checkbox]'));

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let xScale = chartObjects.xScale();
    let yScale = chartObjects.yScale();
    let axes = chartObjects.axes();
    let functions = chartObjects.functions();

    config.padding.top = smallMultiple ? 0 : 15;
    config.margin.bottom = 30;
    config.padding.left = 40;
    config.padding.right = 0;
    // name of first column with values of bands on x axis


    config.yParameter = 'behandeling';  // is being set in type function
    // config.fixedHeight = 160;
    config.minValue = 0;
    // config.maxValue = 60000;

    config.xParameter = '_date';

    config.xScaleType = 'time';
    config.xScaleTicks = 'timeMonth';

    let colours = {

        'MINDER_DAN_12_JAAR': darkblue,
        'TUSSEN_12_EN_1_JAAR': blue,
        'TUSSEN_1_EN_2_JAAR': green,
        'LANGER_DAN_2JAAR': orange,
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

        let neededColumns = ['LANGER_DAN_2JAAR','TUSSEN_1_EN_2_JAAR','TUSSEN_12_EN_1_JAAR','MINDER_DAN_12_JAAR','_date'];

        let data = trimColumnsAndOrder(json,neededColumns);

        data = hasValue(data,'MINDER_DAN_12_JAAR');

        let propertyArray = ['MINDER_DAN_12_JAAR','TUSSEN_12_EN_1_JAAR','TUSSEN_1_EN_2_JAAR','LANGER_DAN_2JAAR'];
        let stackedData = filterData(propertyArray);

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
            chartStackedArea.redraw(dimensions,xScale,yScale,property,dataMapping);

        }

        function update(propertyArray) {

            let stackedData = filterData(propertyArray);
            xScale = chartXScale.set(data.map((e) => e['_date']));
            yScale = chartYScale.set(stackedData,config.yParameter);
            chartStackedArea.draw(data,stackedData);
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