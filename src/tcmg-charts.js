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

    var Procedure  = function Procedure(element) {

        const chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 60;
        config.margin.bottom = 30;
        config.padding.bottom = 30;
        config.padding.left = 260;
        config.xParameter = 'status';  // name of first column with values of bands on x axis
        config.yParameter = 'value';  // is being set in type function

        // get dimensions from parent element
        const chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        const chartSVG = ChartSVG(element,config,dimensions,svg);
        const chartScales = ChartScales(config,dimensions,scales);
        const chartAxis = ChartAxis(config,svg);
        const chartStackedBars = ChartStackedBars(config,svg,functions);
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

            console.log(data);
            data = data.shift();
            console.log(data);

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
            chartStackedBars.draw(data, functions);
            // further drawing happens in function that can be repeated.
            redraw();
            // for example on window resize
            window.addEventListener("resize", redraw, false);
        });

    }

    // procedure.renderSVG();
    // procedure.renderLayers();
    // procedure.setScale();
    // procedure.renderXAxis();
    // procedure.renderYAxis();
    //
    // procedure.renderBars();
    // procedure.renderFlows();


    return {
        procedure : Procedure
    }

}

