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
            xBand: null,
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

        svg.body = d3.select(element, config).append('svg');

        svg.main = svg.body.append('g');
    };

    var redraw = function redraw(dimensions) {
        svg.body.attr('height', dimensions.containerHeight).attr('width', dimensions.containerWidth);

        svg.main.attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')').attr('width', dimensions.containerWidth - config.margin.left - config.margin.right).attr('height', dimensions.containerHeight - config.margin.top - config.margin.bottom);
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

        scales.yLinearReverse = d3.scaleLinear().range([dimensions.height, config.margin.top + config.padding.top]).domain([d3.max(data, function (d) {
            return d[config.yParameter];
        }), 0]).nice();

        scales.xBand = d3.scaleBand()
        // what is domain when working with a stack?
        .domain(data.map(function (d) {
            return d[config.xParameter];
        })).paddingInner([0.5]).paddingOuter([0.25]).align([0.5]);

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

        axes.xBand = d3.axisBottom(scales.xBand);

        axes.xBand;
        // .ticks(d3.timeMonth.every(1))
        // .tickFormat(d3.timeFormat("%b"));

        svg.xAxis.attr("transform", "translate(" + 0 + "," + dimensions.height + ")").call(axes.xBand);
    };

    var drawYAxis = function drawYAxis() {

        svg.yAxis = svg.layers.axes.append("g").attr('class', 'y-axis').attr("transform", "translate(" + config.padding.left + ",0)");
    };

    var redrawYAxis = function redrawYAxis(scales, axes) {

        axes.yLinear = d3.axisLeft(scales.yLinear);

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

        var stackedData = functions.stack.keys(data.columns.slice(1))(data);

        // format data for areaflow
        var format = function format(stack, index) {

            var areaData = [];

            console.log(stackedData[index]);

            if (index < stackedData.length - 1) {

                for (var j = 0; j < 1; j++) {
                    //  -   data.columns.slice(1).length - 1
                    var pathObject = {};

                    pathObject.x0 = stackedData[index][j].data.status; // key = provenance ... moet status zijn
                    pathObject.x1 = stackedData[index][j + 1].data.status;
                    pathObject.y0 = stackedData[index][j][0];
                    pathObject.y1 = stackedData[index][j + 1][0];
                    pathObject.class = stackedData[index].key;

                    areaData.push(pathObject);
                }
            }
            console.log(areaData);
            return areaData;
        };

        // series corresponds to provenance - the columns in the csv table//
        svg.series = svg.layers.data.selectAll(".serie").data(stackedData).enter().append("g").attr("class", function (d) {
            return "serie " + d.key;
        });
        // .attr("fill", function(d) { return z(d.key); })

        svg.bar = svg.series.selectAll("rect").data(function (d) {
            return d;
        }).enter().append("rect");

        svg.connection = svg.series.selectAll('.flow')
        // je moet per serie .. de data reformatten
        .data(function (d, i) {
            return format(d, i);
        }).enter().append("path").attr("fill", "#ccc").attr('class', 'flow');
    };

    var redraw = function redraw(dimensions, scales) {

        var barWidth = 0;

        var area = d3.area()
        // .curve(d3.curveCardinal)
        // console.log(scales.xBand(d[0].data.status)); console.log(scales.xBand(d[1].data.status));
        .x0(function (d, i) {
            if (i < 1) {
                return scales.xBand(d.x0) + barWidth;
            } else {
                return scales.xBand(d.x0);
            }
        }) // console.log(d);
        .x1(function (d, i) {
            if (i < 1) {
                return scales.xBand(d.x1) + barWidth;
            } else {
                return scales.xBand(d.x1);
            }
        }).y0(function (d) {
            console.log(d);return scales.yLinearReverse(d.y0);
        }).y1(function (d) {
            return scales.yLinearReverse(d.y1);
        });

        svg.bar.attr("y", function (d) {
            return scales.yLinear(d[1]);
        }).attr("height", function (d) {
            return scales.yLinearReverse(d[1]) - scales.yLinearReverse(d[0]);
        }).attr("x", function (d) {
            return scales.xBand(d.data[config.xParameter]);
        }).attr("width", scales.xBand.bandwidth());

        svg.connection.attr("d", area);
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
var TCMGCharts = function TCMGCharts() {

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

    var Procedure = function Procedure(element) {

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
        config.xParameter = 'status'; // name of first column with values of bands on x axis
        config.yParameter = 'value'; // is being set in type function

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

        // function to parse csv
        function type(d, i, columns) {
            var t = void 0;
            for (i = 1, t = 0; i < columns.length; ++i) {
                t += d[columns[i]] = +d[columns[i]];
            }d.value = t;
            return d;
        }
        // point of data injection when using an api
        d3.csv("./dummy_data_procedure.csv", type, function (error, data) {
            if (error) throw error;

            console.log(data);

            function redraw() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions, scales);
                // new scales mean new axis
                chartAxis.redrawXAxis(dimensions, scales, axes);
                chartAxis.redrawYAxis(scales, axes);
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