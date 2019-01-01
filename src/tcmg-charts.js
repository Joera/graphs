'use strict';


/**
 *
 */


const locale = d3.timeFormatLocale({
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["€",""],
    "dateTime": "%a %e %B %Y %T",
    "date": "%d-%m-%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
    "shortDays": ["zo", "ma", "di", "wo", "do", "vr", "za"],
    "months": ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
    "shortMonths": ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
});

const formatDates = locale.format("%B %Y");
const currency = locale.format("$,");


var TCMGCharts = function TCMGCharts() {

    // init multiple charts from this file

    var Inputs  = function Inputs(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 25;
        config.padding.bottom = 25;

        config.padding.left = 60;
        config.padding.right = 0;
        config.xParameter = 'key';  // name of first column with values of bands on x axis
        config.yParameter = 'total';  // is being set in type function

        config.fixedHeight = 259;
        config.xAlign = [0.0];

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartBlocks = ChartBlocks(config,svg,functions);

        chartAxis.drawInputYAxis(dimensions);

        d3.csv("./dummy_data_input.csv", function(error, data) {
            if (error) throw error;

            let cummulative = 0;
            for (let i = 0; i < data.length; i++) {
                data[i]['previous'] = cummulative;
                cummulative = cummulative + parseInt(data[i]['total']);
                data[i]['cummulative'] = cummulative;
                data[i]['key'] = 'total';
            }

            function redrawInput() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                //  chartAxis.redrawXBandAxis(dimensions,scales,axes);
                chartAxis.redrawInputYAxis(scales,axes);
                // redraw data
                chartBlocks.redraw(dimensions, scales);
            }

            // with data we can init scales
            scales = chartScales.set([{ 'key' : 'total'}]);
            // width data we can draw items
            chartBlocks.draw(data, functions)
            // further drawing happens in function that can be repeated.
            redrawInput();
            // for example on window resize
            window.addEventListener("resize", redrawInput, false);
        });
    }

    var Legend = function(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();

        config.margin.top = 30;
        config.padding.left = 60;

        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartLegend = ChartLegend(config,svg);

        d3.csv("./dummy_data_input.csv", function(error, data) {
            chartLegend.drawInputLegend(dimensions, data);
        });
    }

    var Procedure  = function Procedure(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 30;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 25;
        config.padding.bottom = 30;
        config.padding.left = 40;
        config.padding.right = 0;
        config.xParameter = 'status';  // name of first column with values of bands on x axis
        config.yParameter = 'value';  // is being set in type function
        config.xAlign = [0.5];
        config.fixedHeight = 157;
        config.minValue = 0;
        config.maxValue = 15000;

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartStackedBars = ChartStackedBars(config,svg,functions);
        let chartBlocks = ChartBlocks(config,svg,functions);
        chartAxis.drawXAxis();
        chartAxis.drawYAxis();

        // function to parse csv
        function type(d, i, columns) {
            let t;
            for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
            d.value = t;
            return d;
        }
        // point of data injection when using an api
        d3.csv("./dummy_data_procedure.csv", type, function(error, data) {
            if (error) throw error;

            // manipulate the data into stacked series
            functions.stack = d3.stack();
            let stackedData = functions.stack.keys(data.columns.slice(1))(data);

            function redraw() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                chartAxis.redrawXBandAxis(dimensions,scales,axes);
                chartAxis.redrawYAxis(scales,axes);
                // redraw data
                chartStackedBars.redraw(dimensions, scales);
                chartBlocks.redraw(dimensions, scales);
            }

            // with data we can init scales
            scales = chartScales.set(data);
            // width data we can draw items
            chartStackedBars.draw(stackedData,functions);
            chartBlocks.draw(data, functions);
            // further drawing happens in function that can be repeated.
            redraw();
            // for example on window resize
            window.addEventListener("resize", redraw, false);
        });
    }

    var Progress = function(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 25;
        config.padding.bottom = 25;
        config.padding.left = 40;
        config.padding.right = 0;
        config.xParameter = 'time';  // name of first column with values of bands on x axis
        config.yParameter = 'total';  // is being set in type function
        config.fixedHeight = 155;
        config.minValue = 17000;
        config.maxValue = 18000;

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartLine = ChartLine(config,svg,functions);

        chartAxis.drawXAxis();
        chartAxis.drawYAxis();

        d3.csv("./dummy_data_progress.csv", function(error, data) {
            if (error) throw error;

            function redraw() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                chartAxis.redrawXTimeAxis(dimensions,scales,axes);
                chartAxis.redrawYAxis(scales,axes);
                // redraw data
                chartLine.redraw(scales,functions);

            }

            scales = chartScales.set(data);
            chartLine.draw(data);
            // further drawing happens in function that can be repeated.
            redraw();
            // for example on window resize
            window.addEventListener("resize", redraw, false);

        });
    }

    var Remitted = function Remitted(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 25;
        config.padding.bottom = 25;
        config.padding.left = 0;
        config.padding.right = 0;

        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);

        d3.csv("./dummy_data_output.csv", function(error, data) {

            console.log(data[0].value);

            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);

            svg.layers.data.append('text')
                .text(currency(parseInt(data[0].value)))
                .attr("text-anchor","middle")
                .attr("x","50%");
            ;

        });

    }

    var Outputs  = function Outputs(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 25;
        config.padding.bottom = 25;
        config.padding.left = 60;
        config.padding.right = 0;
        config.xParameter = 'key';  // name of first column with values of bands on x axis
        config.yParameter = 'total';  // is being set in type function
        config.fixedHeight = 259;
        config.xAlign = [0.0];

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartBlocks = ChartBlocks(config,svg,functions);

        chartAxis.drawInputYAxis(dimensions);

        d3.csv("./dummy_data_output.csv", function(error, data) {
            if (error) throw error;

            let cummulative = 0;
            for (let i = 0; i < data.length; i++) {
                data[i]['previous'] = cummulative;
                cummulative = cummulative + parseInt(data[i]['total']);
                data[i]['cummulative'] = cummulative;
                data[i]['key'] = 'total';
            }

            function redrawInput() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                //  chartAxis.redrawXAxis(dimensions,scales,axes);
                chartAxis.redrawInputYAxis(scales,axes);
                // redraw data
                chartBlocks.redraw(dimensions, scales);
            }

            // with data we can init scales
            scales = chartScales.set([{ 'key' : 'total'}]);
            // width data we can draw items
            chartBlocks.draw(data, functions)
            // further drawing happens in function that can be repeated.
            redrawInput();
            // for example on window resize
            window.addEventListener("resize", redrawInput, false);
        });
    }

    return {
        inputs : Inputs,
        legend : Legend,
        procedure : Procedure,
        progress : Progress,
        remitted : Remitted,
        outputs : Outputs
    }
}

