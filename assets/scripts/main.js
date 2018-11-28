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

        console.log('kwashier');
    };

    var setScale = function setScale() {

        xScale = d3.scaleBand().rangeRound([config.padding.left, width]).domain([0, data.length]);
        //
        // // y scale
        yScale = d3.scaleLinear().range([0, height]).domain([d3.max(data.map(function (d) {
            return d.total;
        })), 0]);
    };

    var renderYAxis = function renderYAxis() {

        var totalAxis = d3.axisLeft(yScale);

        layers.axis.append("g").attr('class', 'total-axis').attr("transform", "translate(0,30)").call(totalAxis);
    };

    var bars = function bars() {};

    return {

        renderSVG: renderSVG,
        renderLayers: renderLayers,
        setScale: setScale,
        renderYAxis: renderYAxis,
        bars: bars

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

    return {
        procedure: procedure
    };
};