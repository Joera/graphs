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
            top: 0,
            bottom: 0,
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
        }));
        //
        // // y scale
        yScale = d3.scaleLinear().range([height - config.margin.bottom, config.margin.top]).domain([0, d3.max(data, function (d) {
            return d.total;
        })]).nice();
    };

    var renderYAxis = function renderYAxis() {

        var totalAxis = d3.axisLeft(yScale);

        layers.axis.append("g").attr('class', 'total-axis').attr("transform", "translate(0,30)").call(totalAxis);
    };

    var renderBars = function renderBars() {

        var bar = layers.bars.selectAll('.bar').data(data).enter().append('rect').attr('y', function (d) {
            console.log(d);
            return yScale(d.total);
        }).attr('x', function (d, i) {
            return xScale(d.name);
        }).attr('width', barWidth).attr('height', function (d) {
            return yScale(d.total);
        }).attr('class', 'bar');
    };

    return {

        renderSVG: renderSVG,
        renderLayers: renderLayers,
        setScale: setScale,
        renderYAxis: renderYAxis,
        renderBars: renderBars

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
    procedure.renderYAxis();
    procedure.renderBars();

    return {
        procedure: procedure
    };
};