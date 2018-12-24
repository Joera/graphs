'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ChartObjects = function ChartObjects() {

    var config = function config() {

        return {
            margin: { // space around chart
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            padding: { // room for axis
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        };
    };

    var dimensions = function dimensions() {

        return {
            containerWidth: 0, // width of element minus config.margin
            width: 0, // containerWidth minus config.padding
            containerHeight: 0, // height of element minus config.margin
            height: 0 // containerHeight minus config.padding

        };
    };

    var svg = function svg() {

        return {
            body: null,
            layers: {},
            yAxis: null,
            xAxis: null,
            area: null,
            line: null,
            bar: null,
            series: null // stacked-bars
        };
    };

    var scales = function scales() {

        return {
            xTime: null,
            yLinear: null
        };
    };

    var axes = function axis() {

        return {
            xTime: null,
            yLinear: null
        };
    };

    var functions = function functions() {

        return {
            area: null,
            line: null,
            stack: null
        };
    };

    return {
        config: config,
        dimensions: dimensions,
        svg: svg,
        scales: scales,
        axes: axes,
        functions: functions

    };
};

var ChartDimensions = function ChartDimensions(element, config) {

    var get = function get(dimensions) {

        dimensions.containerWidth = d3.select(element).node().getBoundingClientRect().width - config.margin.left - config.margin.right;
        dimensions.containerHeight = d3.select(element).node().getBoundingClientRect().height - config.margin.top - config.margin.bottom;
        dimensions.height = dimensions.containerHeight - config.padding.top - config.padding.bottom;
        dimensions.width = dimensions.containerWidth - config.padding.left - config.padding.right;

        return dimensions;
    };

    return {

        get: get
    };
};
var ChartSVG = function ChartSVG(element, config, dimensions, svg) {

    var render = function render() {

        svg.body = d3.select(element, config).append('svg').attr('height', dimensions.height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom).append('g').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
    };

    var redraw = function redraw(dimensions) {
        svg.body.attr('width', dimensions.containerWidth);
    };

    var layers = function layers() {

        svg.layers.data = svg.body.append('g').attr('class', 'data');
        svg.layers.axes = svg.body.append('g').attr('class', 'axes');
    };

    render();
    layers();

    return _defineProperty({
        redraw: redraw }, 'redraw', redraw);
};

var ChartScales = function ChartScales(config, dimensions, scales) {

    var set = function set(data) {

        var endDate = new Date();

        scales.xTime = d3.scaleTime().domain([d3.min(data, function (d) {
            return new Date(d.date);
        }), endDate]);

        scales.yLinear = d3.scaleLinear().range([dimensions.height, config.margin.top + config.padding.top]).domain([0, d3.max(data, function (d) {
            return d[config.yParameter];
        })]).nice();

        scales.xBand = d3.scaleBand()
        // what is domain when working with a stack?
        .domain(data.map(function (d) {
            return d[config.xParameter];
        })).paddingInner([0.1]).paddingOuter([0.3]).align([0.5]);

        return scales;
    };

    var reset = function reset(dimensions, newScales) {

        newScales.xTime.range([config.margin.left + config.padding.left, dimensions.width]);

        newScales.xBand
        // or does this
        .range([config.margin.left + config.padding.left, dimensions.width]);

        return newScales;
    };

    return {
        set: set,
        reset: reset
    };
};

var ChartAxis = function ChartAxis(config, svg) {

    var drawXAxis = function drawXAxis() {

        svg.xAxis = svg.layers.axes.append("g").attr('class', 'x-axis');
    };

    var redrawXAxis = function redrawXAxis(dimensions, scales, axes) {

        axes.xTime = d3.axisBottom(scales.xTime);

        axes.xTime.ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b"));

        svg.xAxis.attr("transform", "translate(" + 0 + "," + dimensions.height + ")").call(axes.xTime);
    };

    var drawYAxis = function drawYAxis() {

        svg.yAxis = svg.layers.axes.append("g").attr('class', 'y-axis');
    };

    var redrawYAxis = function redrawYAxis(scales, axes) {

        axes.yLinear = d3.axisRight(scales.yLinear);

        axes.yLinear.ticks(2);

        svg.yAxis.call(axes.yLinear);
    };

    return {
        drawXAxis: drawXAxis,
        redrawXAxis: redrawXAxis,
        drawYAxis: drawYAxis,
        redrawYAxis: redrawYAxis
    };
};

var ChartLine = function ChartLine(config, svg) {

    var draw = function draw(data) {

        svg.line = svg.layers.data.append("path").data([data]).attr("class", "line");
    };

    var redraw = function redraw(scales, functions) {

        functions.line = d3.line().x(function (d) {
            return scales.xTime(new Date(d.date));
        }).y(function (d) {
            return scales.yLinear(d[config.yParameter]);
        });

        svg.line.attr("d", functions.line);
    };

    return {
        draw: draw,
        redraw: redraw
    };
};

var ChartBar = function ChartBar(config, svg) {

    var draw = function draw(data) {

        svg.bar = svg.layers.data.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar");
    };

    var redraw = function redraw(dimensions, scales, data) {

        var stack = d3.stack().keys(stackKey).order(d3.stackOrderNone).offset(d3.stackOffsetNone);

        var barWidth = (dimensions.width - config.padding.left - config.padding.right) / data.length - 2;

        svg.bar.attr("x", function (d) {
            return scales.xTime(new Date(d.date));
        }).attr("y", function (d) {
            return scales.yLinear(d.value);
        }).attr("height", function (d) {
            return dimensions.height - scales.yLinear(d.value);
        }).attr("width", barWidth);
    };

    return {
        draw: draw,
        redraw: redraw
    };
};

var ChartStackedBars = function ChartStackedBars(config, svg, functions) {

    var draw = function draw(data) {

        // manipulate the data into stacked series
        functions.stack = d3.stack();

        // var series = stack(data);
        // console.log(series);


        // series corresponds to provenance - the columns in the csv table//
        svg.series = svg.layers.data.selectAll(".serie").data(functions.stack.keys(data.columns.slice(1))(data)).enter().append("g").attr("class", "serie")
        // .attr("fill", function(d) { return z(d.key); })
        .selectAll("rect").data(function (d) {
            return d;
        }).enter().append("rect").attr("x", function (d) {
            return x(d.data[config.xParameter]);
        }).attr("y", function (d) {
            return y(d[1]);
        }).attr("height", function (d) {
            return y(d[0]) - y(d[1]);
        });
    };

    var redraw = function redraw(dimensions, scales) {

        svg.series.attr("width", x.bandwidth());
    };

    return {
        draw: draw,
        redraw: redraw
    };
};

var ChartArea = function ChartArea(config, svg) {

    var draw = function draw(data) {

        svg.area = svg.layers.data.selectAll('.flow').data([data]).enter().append("path").attr("fill", "#f6f5f2").attr('class', 'flow');
    };

    var redraw = function redraw(scales, functions) {

        functions.area = d3.area().x0(function (d, i) {
            return scales.xTime(new Date(d.date));
        }).x1(function (d, i) {
            return scales.xTime(new Date(d.date));
        }).y0(scales.yLinear(0)).y1(function (d) {
            return scales.yLinear(d[config.yParameter]);
        });

        svg.area.attr("d", functions.area);
    };

    return {

        draw: draw,
        redraw: redraw
    };
};
'use strict';

/**
 *
 */
var TCMGCharts = function TCMGCharts(data) {

    // init multiple charts from this file

    var locale = d3.timeFormatLocale({
        "dateTime": "%a %e %B %Y %T",
        "date": "%d-%m-%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
        "shortDays": ["zo", "ma", "di", "wo", "do", "vr", "za"],
        "months": ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
        "shortMonths": ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
    });

    var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    var formatDates = locale.format("%B %Y");

    var dataset = data;

    var Procedure = function Procedure(el) {

        var element = el;

        var chartObjects = ChartObjects();
        var config = chartObjects.config();
        var dimensions = chartObjects.dimensions();
        var svg = chartObjects.svg();
        var scales = chartObjects.scales();
        var axes = chartObjects.axes();
        var functions = chartObjects.functions();

        config.margin.top = 60;
        config.margin.bottom = 30;
        config.padding.bottom = 30;
        config.padding.left = 60;
        config.xParameter = 'name';

        // get dimensions from parent element
        var chartDimensions = ChartDimensions(element, config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        var chartSVG = ChartSVG(element, config, dimensions, svg);
        var chartScales = ChartScales(config, dimensions, scales);
        var chartAxis = ChartAxis(config, svg);
        var chartStackedBars = ChartStackedBars(config, svg, functions);
        chartAxis.drawXAxis();
        chartAxis.drawYAxis();

        // point of data injection when using an api

        function redraw() {

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
    };

    // procedure.renderSVG();
    // procedure.renderLayers();
    // procedure.setScale();
    // procedure.renderXAxis();
    // procedure.renderYAxis();
    //
    // procedure.renderBars();
    // procedure.renderFlows();


    return {
        procedure: Procedure
    };
};