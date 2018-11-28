'use strict';

/**
 *
 */

var Procedure = function Procedure(el, data) {

    var svg = null;
    var element = el;
    var dataset = data;
    var layers = {};
    var xScale = void 0;
    var yScale = void 0;

    var containerWidth = d3.select(element).node().getBoundingClientRect().width;

    var barWidth = 80;

    var config = {

        margin: {
            top: 60,
            bottom: 60,
            left: 60,
            right: 0
        },

        padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    };

    var height = 400;
    var width = containerWidth - config.margin.left - config.margin.right - config.padding.left - config.padding.right;

    var renderSVG = function createSVG() {

        svg = d3.select(element).append('svg')
        // .attr('width', (this.width + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
        .attr('width', containerWidth + config.margin.left + config.margin.right + config.padding.left + config.padding.right).attr('height', height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom).append('g').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
    };

    var renderLayers = function renderLayers() {

        layers.axis = svg.append('g').attr('class', 'axis');

        layers.bars = svg.append('g').attr('class', 'bars');
    };

    var setScale = function setScale() {

        xScale = d3.scaleBand().range([config.margin.left, width - config.margin.right]).domain(data.map(function (d) {
            return d.name;
        })).paddingInner([0.1]).paddingOuter([0.3]).align([0.5]);
        //
        // // y scale
        yScale = d3.scaleLinear().range([height - config.margin.bottom, config.margin.top]).domain([0, d3.max(data, function (d) {
            return d.total;
        })]).nice();
    };

    var renderYAxis = function renderYAxis() {

        var totalAxis = d3.axisLeft(yScale);

        layers.axis.append("g").attr('class', 'total-axis').attr("transform", "translate(0,0)").call(totalAxis);
    };

    var renderXAxis = function renderYAxis() {

        var statusAxis = d3.axisBottom(xScale);

        layers.axis.append("g").attr('class', 'status-axis').attr("transform", "translate(" + (-barWidth / 2 - 10) + "," + (height - config.margin.bottom) + ")").call(statusAxis);
    };

    var renderBars = function renderBars() {

        var bar = layers.bars.selectAll('.bar').data(data).enter().append('rect').attr('y', function (d) {
            return yScale(d.total);
        }).attr('x', function (d, i) {
            return xScale(d.name);
        }).attr('width', barWidth).attr('height', function (d) {
            return yScale(0) - yScale(d.total);
        }).attr('class', 'bar');
    };

    var renderFlows = function renderFlows() {

        var area = void 0;
        var areaElement = void 0;
        var areas = [];

        // for (let i = 0; i < data.length - 1; i++) {
        //
        //     console.log(data[i])
        //
        //     area = d3.area()
        //         .x0(xScale(data[i].name + (barWidth / 2)))
        //         .x1(xScale(data[i + 1].name - (barWidth / 2)))
        //         .y0(yScale(0))
        //         .y1(yScale(data[i + 1].total));
        //
        //
        //
        //     areas.push(area);
        // }

        var test = [[{ x0: 20, x1: 60, y0: 0, y1: 0 }, { x0: 20, x1: 60, y0: 20, y1: 20 }], [{ x0: 100, x1: 600, y0: 20, y1: 20 }, { x0: 100, x1: 600, y0: 200, y1: 200 }]];

        var areaFunc = d3.area().interpolate('step').x0(function (d) {
            return xScale(d.x0);
        }).x1(function (d) {
            return xScale(d.x1);
        }).y0(function (d) {
            return yScale(d.y0);
        }).y1(function (d) {
            return yScale(d.y1);
        });

        svg.selectAll('path').data(test).enter().append("path").attr("d", areaFunc).attr("fill", "steelblue").attr('class', 'flow');
    };

    return {

        renderSVG: renderSVG,
        renderLayers: renderLayers,
        setScale: setScale,
        renderXAxis: renderXAxis,
        renderYAxis: renderYAxis,
        renderBars: renderBars,
        renderFlows: renderFlows

    };
};
'use strict';

/**
 *
 */
var Graph = function Graph(el, data) {

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

    var element = el;
    var dataset = data;
    var config = {};

    var procedure = Procedure(element, dataset.procedure); // hier kun je data uitsplitsen

    procedure.renderSVG();
    procedure.renderLayers();
    procedure.setScale();
    procedure.renderXAxis();
    procedure.renderYAxis();

    procedure.renderBars();
    procedure.renderFlows();

    return {
        procedure: procedure
    };
};