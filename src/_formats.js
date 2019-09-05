'use strict';


/**
 *
 */


const localCurrency = d3.formatDefaultLocale({
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["€",""],
});

const localTime = d3.timeFormatLocale({
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["€",""],
    "dateTime": "%a %e %B %Y %T",
    "date": "%d-%m-%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
    "shortDays": ["zo", "ma", "di", "wo", "do", "vr", "za"],
    "months": ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
    "shortMonths": ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
});

const formatDates = localTime.format("%B %Y");
const currency = localCurrency.format("$,");