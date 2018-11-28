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
    var colourMap = void 0;

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

        //     .offset("zero")
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

        // colourMap = d3.scaleOrdinal(d3.schemeCategory20)
        //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"])
        //     .domain(data.columns.slice(3));
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

        console.log('nieuw');

        var stack = d3.stack().keys([0, 1, 2, 3]);
        stack.value(function (d, key) {
            return d[key].y;
        });

        var stackedData = data.map(function (d) {
            return d.map(function (p, i) {
                return {
                    'key': d.name,
                    'value': p
                };
            });
        });

        console.log(stackedData);

        var category = layers.bars.selectAll(".category").data(stackedData).enter().append("g").attr("class", function (d, i) {
            return d.id + ' category';
        });
        // .style("fill", function(d, i) { return color(i); });


        var bar = category.selectAll(".bar").data(function (d) {
            return d;
        }).enter().append('rect').attr('y', function (d) {
            return yScale(d.value);
        }).attr('x', function (d, i) {
            return xScale(d.key);
        }).attr('width', barWidth).attr('height', function (d) {
            return yScale(0) - yScale(d.value);
        }).attr('class', 'bar');
    };

    var renderFlows = function renderFlows() {

        var areaData = [];

        for (var i = 0; i < data.length - 1; i++) {
            //  -

            areaData.push([data[i], data[i + 1]]);
        }

        var area = d3.area().curve(d3.curveCardinal).x0(function (d, i) {
            if (i < 1) {
                return xScale(d.name) + barWidth;
            } else {
                return xScale(d.name);
            }
        }).x1(function (d, i) {
            if (i < 1) {
                return xScale(d.name) + barWidth;
            } else {
                return xScale(d.name);
            }
        }).y0(yScale(0)).y1(function (d) {
            return yScale(d.total);
        });

        layers.bars.selectAll('.flow').data(areaData).enter().append("path").attr("d", area).attr("fill", "#ccc").attr('class', 'flow');
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