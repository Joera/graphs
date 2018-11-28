'use strict';

/**
 *
 */

var Procedure = function Procedure(el, data) {

    var svg = null;
    var element = el;
    var dataset = data;

    var containerWidth = d3.select(element).node().getBoundingClientRect().width;

    var config = {

        margin: {
            top: 0,
            bottom: 0,
            left: 0,
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

    var createSVG = function createSVG() {

        svg = d3.select(element).append('svg')
        // .attr('width', (this.width + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
        .attr('width', containerWidth + config.margin.left + config.margin.right + config.padding.left + config.padding.right).attr('height', height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom).append('g').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
    };

    var setScale = function setScale() {

        console.log(data);

        var xScale = d3.scaleLinear().range([config.padding.left, width]).domain([0, data.length]);
        //
        // // y scale
        // this.yScale = d3.scaleBand()
        //     .rangeRound([0, this.height])
        //     .domain(this.dataset.map(d => {
        //         return parseInt(d.position);
        //     }).filter((value, index, self) => {
        //         return self.indexOf(value) === index;
        //     }).sort());
    };

    var yAxis = function yAxis() {};

    return {

        createSVG: createSVG,
        setScale: setScale,
        yAxis: yAxis

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

    procedure.createSVG();
    procedure.setScale();
    procedure.yAxis();

    return {
        procedure: procedure
    };
};