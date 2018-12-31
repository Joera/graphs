'use strict';


/**
 *
 */
var TCMGCharts = function TCMGCharts() {

    // init multiple charts from this file

    const locale = d3.timeFormatLocale({
        "dateTime": "%a %e %B %Y %T",
        "date": "%d-%m-%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
        "shortDays": ["zo", "ma", "di", "wo", "do", "vr", "za"],
        "months": ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
        "shortMonths": ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
    });

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    let formatDates = locale.format("%B %Y");

    var Inputs  = function Inputs(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.fixedHeight = 300;
        config.margin.top = 30;
        config.margin.bottom = 30;
        config.margin.left = 60;
        config.padding.top = 0;
        config.padding.bottom = 30;
        config.padding.left = 0;
        config.padding.right = 0;
        config.xParameter = 'status';  // name of first column with values of bands on x axis
        config.yParameter = 'value';  // is being set in type function

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartInput = ChartInput(config,svg,functions);

        chartAxis.drawInputYAxis(dimensions);

        d3.csv("./dummy_data_input.csv", function(error, data) {
            if (error) throw error;

            let cummulative = 0;
            for (let i = 0; i < data.length; i++) {
                data[i]['previous'] = cummulative;
                cummulative = cummulative + parseInt(data[i]['total']);
                data[i]['cummulative'] = cummulative;
            }

            function redrawInput() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                console.log(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                //  chartAxis.redrawXAxis(dimensions,scales,axes);
                chartAxis.redrawInputYAxis(scales,axes);
                // redraw data
                chartInput.redraw(dimensions, scales);
            }

            // with data we can init scales
            scales = chartScales.set(data);
            // width data we can draw items
            chartInput.draw(data, functions)
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

        config.margin.top = 15;
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

        config.margin.top = 30;
        config.margin.bottom = 30;
        config.margin.left = 60;
        config.padding.bottom = 30;
        config.padding.left = 0;
        config.padding.right = 0;
        config.xParameter = 'status';  // name of first column with values of bands on x axis
        config.yParameter = 'value';  // is being set in type function

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartStackedBars = ChartStackedBars(config,svg,functions);
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

            function redraw() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                chartAxis.redrawXAxis(dimensions,scales,axes);
                chartAxis.redrawYAxis(scales,axes);
                // redraw data
                chartStackedBars.redraw(dimensions, scales);
            }

            // with data we can init scales
            scales = chartScales.set(data);
            // width data we can draw items
            chartStackedBars.draw(data,functions);
            // further drawing happens in function that can be repeated.
            redraw();
            // for example on window resize
            window.addEventListener("resize", redraw, false);
        });



    }

    var Outputs  = function Outputs(element) {


    }



    return {
        inputs : Inputs,
        legend : Legend,
        procedure : Procedure,
        outputs : Outputs
    }

}

