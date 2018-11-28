'use strict';


/**
 *
 */
var Graph = function Graph(el,data) {

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

    let element = el;
    let dataset = data;
    let config = {};

    const procedure = Procedure(element,dataset.procedure); // hier kun je data uitsplitsen

    procedure.renderSVG();
    procedure.renderLayers();
    procedure.setScale();
    procedure.renderXAxis();
    procedure.renderYAxis();

    procedure.renderBars();


    return {
        procedure : procedure
    }

}

