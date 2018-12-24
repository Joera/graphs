'use strict';


/**
 *
 */
var TCMGCharts = function TCMGCharts(data) {

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

    let dataset = data;


    var Procedure  = function Procedure(el) {

        let element = el;

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
        config.padding.left = 60;
        config.xParameter = 'name';

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

        // point of data injection when using an api

        function redraw() {

            chartStackedBars.redraw(dimensions,scales);
        }

        // with data we can init scales
        scales = chartScales.set(data);
        // width data we can draw items
        chartStackedBars.draw(data,functions);
        // further drawing happens in function that can be repeated.
        redraw();
        // for example on window resize
        window.addEventListener("resize", redraw,false);

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

