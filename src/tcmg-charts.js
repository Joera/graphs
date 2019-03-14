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

var trimColumns =  function(csv,neededColumns) {

    csv.columns = csv.columns.filter( (c) => {
        return neededColumns.indexOf(c) > -1;
    });

    csv.forEach( (week,i) => {
        Object.keys(week).forEach( (key) => {
            if (neededColumns.indexOf(key) < 0) {
                delete week[key];
            }
        });
    });
    return csv;
};



var TCMGCharts = function TCMGCharts() {

    // init multiple charts from this file

    var Inputs  = function Inputs(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 30;
        config.padding.bottom = 30;

        config.padding.left = 60;
        config.padding.right = 0;
        config.xParameter = 'provenance';  // name of first column with values of bands on x axis
        config.yParameter = 'total';  // is being set in type function

        // y-scale
        config.fixedWidth = 100 + 6;
        config.minValue = 0;
        config.maxValue = 25000;


        // x-scale
        config.xAlign = [0.0];
        config.paddingInner = [0.0];
        config.paddingOuter = [0.0];

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartBlocks = ChartBlocks(config,svg,functions);

        chartAxis.drawBlocksYAxis(dimensions);

        d3.csv("./dummy_data_input.csv", function(error, data) {
            if (error) throw error;

            let cummulative = 0;
            for (let i = 0; i < data.length; i++) {
                data[i]['previous'] = cummulative;
                cummulative = cummulative + parseInt(data[i]['total']);
                data[i]['cummulative'] = cummulative;
                data[i]['key'] = 'total';
            }

            function redrawInput() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                //  chartAxis.redrawXBandAxis(dimensions,scales,axes);
                chartAxis.redrawBlocksYAxis(scales,axes);
                // redraw data
                chartBlocks.redraw(dimensions, scales);
            }

            // with data we can init scales
            scales = chartScales.set([{ 'key' : 'total'}]);
            // width data we can draw items
            chartBlocks.draw(data, functions)
            // further drawing happens in function that can be repeated.
            redrawInput();
            // for example on window resize
            window.addEventListener("resize", redrawInput, false);
        });
    }

    var LegendInput = function(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();

        config.margin.top = 10;
        config.padding.left = 60;
        config.padding.bottom = 10;
        config.margin.bottom = 0;

        config.xParameter = 'provenance';

        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartLegend = ChartLegend(config,svg);

        d3.csv("./dummy_data_input.csv", function(error, data) {

            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);
            chartLegend.drawInputLegend(dimensions, data);

        });
    }

    var Procedure  = function Procedure(element) {

        var procedureSelect = document.getElementById("select-municipality");

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 30;
        config.padding.bottom = 30;
        config.padding.left = 40;
        config.padding.right = 0;
        // name of first column with values of bands on x axis

        // y-axis
        config.yParameter = 'totaal';
        config.minValue = 0;
        // config.maxValue = 10000;
        config.fixedHeight = 160;

        // x-axis
        config.minWidth = 460;
        config.xParameter = 'status';
        config.paddingInner = [0.5];
        config.paddingOuter = [0.25];

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartBar = ChartBar(config,svg);
       // let chartStackedBars = ChartStackedBars(config,svg,functions);
      //  let chartBlocks = ChartBlocks(config,svg,functions);
        chartAxis.drawXAxis();
        chartAxis.drawYAxis();

        // function to parse csv
        function type(d, i, columns) {
            let t;
            for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
            d.value = t;
            return d;
        }
        // point of data injection when using an api
        d3.csv("./dummy_data_procedure.csv", type, function(error, csv){
            if (error) throw error;

            // manipulate the data into stacked series

            function prepareData(csv,filter) {

                let data = [];

                data.push({
                    status: "Wacht op opname",
                    totaal: csv[3][filter] + csv[6][filter]

                });

                data.push({
                    status: "Wacht op rapport",
                    totaal: csv[5][filter]

                });

                data.push({
                    status: "Tijd voor zienswijze",
                    totaal: 0

                });

                data.push({
                    status: "Voorbereiding besluit",
                    totaal: csv[7][filter]

                });

                data.columns = csv.columns;

                return data;
            }



            function draw(data) {

                // with data we can init scales
                scales = chartScales.set(data);
                // width data we can draw items
                chartBar.draw(data, functions);

            }

            function redraw() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                chartAxis.redrawXBandAxis(dimensions,scales,axes);
                chartAxis.redrawYAxis(scales,axes);
                // redraw data
                chartBar.redraw(dimensions,scales);
             //   chartBlocks.redraw(dimensions, scales);
            }

            function run(filter) {
                let data = prepareData(csv,filter);
                draw(data);
                redraw();
            }

            // further drawing happens in function that can be repeated

            // for example on window resize
            window.addEventListener("resize", redraw, false);

            procedureSelect.addEventListener("change", function() {
                run(procedureSelect.options[procedureSelect.selectedIndex].value);
            });

            run('totaal');
            // hij lijkt alleen elementen te vullen bij een update
            run('totaal');
        });
    }

    var ProcedureAlt  = function ProcedureAlt(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 30;
        config.padding.bottom = 30;
        config.padding.left = 40;
        config.padding.right = 0;
          // name of first column with values of bands on x axis



        // y-axis
        config.yParameter = 'value';
        config.minValue = 0;
        config.maxValue = 17000;

        // x-axis
        config.minWidth = 460;
        config.xParameter = 'status';
        config.paddingInner = [0.5];

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartStackedBars = ChartStackedBars(config,svg,functions);
        let chartBlocks = ChartBlocks(config,svg,functions);
        chartAxis.drawXAxis();
        chartAxis.drawBlocksYAxis();

        // function to parse csv
        function type(d, i, columns) {
            let t;
            for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
            d.value = t;
            return d;
        }
        // point of data injection when using an api
        d3.csv("./dummy_data_procedure_alt.csv", type, function(error, data) {
            if (error) throw error;

            // manipulate the data into stacked series
            functions.stack = d3.stack();
            let stackedData = functions.stack.keys(data.columns.slice(1))(data);

            function redraw() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                chartAxis.redrawXBandAxis(dimensions,scales,axes);
                chartAxis.redrawBlocksYAxis(scales,axes);
                // redraw data
                chartStackedBars.redraw(dimensions, scales);
                chartBlocks.redraw(dimensions, scales);
            }

            // with data we can init scales
            scales = chartScales.set(data);
            // width data we can draw items
            chartStackedBars.draw(stackedData,functions);
            chartBlocks.draw(data, functions);
            // further drawing happens in function that can be repeated.
            redraw();
            // for example on window resize
            window.addEventListener("resize", redraw, false);
        });
    }

    var Progress = function(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 30;
        config.padding.bottom = 30;
        config.padding.left = 40;
        config.padding.right = 0;
         // name of first column with values of bands on x axis


        config.yParameter = 'behandeling';  // is being set in type function
        config.fixedHeight = 160;
        config.minValue = 0;
        config.maxValue = 22000;


        config.xParameter = 'date';
        config.minWidth = 460;



        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartStackedArea = ChartStackedArea(config,svg,functions);

        chartAxis.drawXAxis();
        chartAxis.drawYAxis();

        d3.csv("./dummy_data_progress_extended.csv", function(error, csv) {
            if (error) throw error;

     //       let neededColumns = ['date','aos','besluiten','inbehandeling','meldingen','opnames'];
            let neededColumns = ['date','behandeling','afgehandeld'];

            let data = trimColumns(csv,neededColumns);
            // csv.columns = [csv.columns[0],csv.columns[2],csv.columns[1]];

            functions.stack = d3.stack();
            let stackedData = functions.stack.keys(data.columns.slice(1))(data);

            function redraw() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                chartAxis.redrawXTimeAxis(dimensions,scales,axes);
                chartAxis.redrawYAxis(scales,axes);
                // redraw data
                chartStackedArea.redraw(dimensions,scales);

            }

            scales = chartScales.set(data);
            chartStackedArea.draw(stackedData,functions);
            // further drawing happens in function that can be repeated.
            redraw();
            // for example on window resize
            window.addEventListener("resize", redraw, false);

        });
    }

    var ProgressCandles = function(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 30;
        config.padding.bottom = 30;
        config.padding.left = 40;
        config.padding.right = 0;
        // name of first column with values of bands on x axis


        config.yParameter = 'behandeling';  // is being set in type function
        config.fixedHeight = 160;
        config.minValue = 15500;
        config.maxValue = 17000;


        config.xParameter = 'date';
        config.minWidth = 460;



        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartLine = ChartLine(config,svg,functions);
     //   let chartStackedArea = ChartStackedArea(config,svg,functions);

        chartAxis.drawXAxis();
        chartAxis.drawYAxis();

        d3.csv("./dummy_data_progress_extended.csv", function(error, data) {
            if (error) throw error;

            data.forEach( (week,i) => {

                    if (i > 1) {
                        week.increase = data[i].meldingen - data[i - 1].meldingen;
                        week.decrease = data[i].afgehandeld - data[i - 1].afgehandeld;
                    } else {
                        week.increase = 0;
                        week.decrease = 0;
                    }
            });

            function redraw() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                chartAxis.redrawXTimeAxis(dimensions,scales,axes);
                chartAxis.redrawYAxis(scales,axes);
                // redraw data
                chartLine.redraw(scales,functions);
            }

            scales = chartScales.set(data);
            chartLine.draw(data);
            // further drawing happens in function that can be repeated.
            redraw();
            // for example on window resize
            window.addEventListener("resize", redraw, false);

        });
    }

    var Remitted = function Remitted(element) {

        let container = document.querySelector(element);

        // let chartObjects = ChartObjects();
        // let config = chartObjects.config();
        // let dimensions = chartObjects.dimensions();
        // let svg = chartObjects.svg();
        // let scales = chartObjects.scales();
        // let axes = chartObjects.axes();
        // let functions = chartObjects.functions();
        //
        // config.margin.top = 0;
        // config.margin.bottom = 0;
        // config.margin.left = 0;
        // config.margin.right = 0;
        // config.padding.top = 30;
        // config.padding.bottom = 0;
        // config.padding.left = 0;
        // config.padding.right = 0;
        // config.fixedHeight = 20;
        //
        // let chartDimensions = ChartDimensions(element,config);
        // dimensions = chartDimensions.get(dimensions);
        //
        // // create svg elements without data
        // let chartSVG = ChartSVG(element,config,dimensions,svg);

        function monies(amount) {


            return ("€" + amount).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });

        }

        d3.csv("./dummy_data_remitted.csv", function(error, data) {

            // let text = svg.layers.data.append('text')
            //     .text(data[0].key + ': ' + currency(data[0].total))
            //     .attr('class','number')
            //     .attr("text-anchor","middle");

            let table = document.createElement('table');

            // thead
            let tr = document.createElement('tr');
            for (let d in data[0]) {
                let td = document.createElement('td');
                td.innerText = d;
                tr.appendChild(td)
            }
            table.appendChild(tr);


            // tbody
            data.forEach( (row) => {

                tr = document.createElement('tr');

                for (let d in row) {

                    let td = document.createElement('td');

                    if (Number.isInteger(parseInt(row[d]))) {
                        td.innerText = monies(row[d]);
                    } else if(row[d] !== undefined) {
                        td.innerText = row[d];
                    }

                    tr.appendChild(td)
                }

                table.appendChild(tr);
            })

            container.appendChild(table);


            // function redraw() {
            //
            //     dimensions = chartDimensions.get(dimensions);
            //     chartSVG.redraw(dimensions);
            //     text.attr("x","50%");
            // }
            //
            // redraw();
            // window.addEventListener("resize", redraw, false);

        });

    }

    var Outputs  = function Outputs(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 30;
        config.padding.bottom = 30;
        config.padding.left = 60;
        config.padding.right = 0;
         // name of first column with values of bands on x axis
          // is being set in type function

        // y-scale
        config.yParameter = 'Totaal';
        config.minValue = 0;
        config.maxValue = 10000;
        // x-scale
        config.fixedWidth = 100 + 6;
        config.xParameter = 'Uitkomst';

        config.paddingInner = [0.0];
        config.paddingOuter = [0.0];

        // get dimensions from parent element
        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);
        let chartBlocks = ChartBlocks(config,svg,functions);

        chartAxis.drawBlocksYAxis(dimensions);

        d3.csv("./dummy_data_output.csv", function(error, data) {
            if (error) throw error;

            let cummulative = 0;
            for (let i = 0; i < data.length; i++) {
                data[i]['previous'] = cummulative;
                cummulative = cummulative + parseInt(data[i]['Totaal']);
                data[i]['cummulative'] = cummulative;
                data[i]['key'] = 'Totaal';
            }

            function redrawInput() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                //  chartAxis.redrawXAxis(dimensions,scales,axes);
                chartAxis.redrawBlocksYAxis(scales,axes);
                // redraw data
                chartBlocks.redraw(dimensions, scales);
            }

            // with data we can init scales
            scales = chartScales.set([{ 'key' : 'Totaal'}]);
            // width data we can draw items
            chartBlocks.draw(data, functions)
            // further drawing happens in function that can be repeated.
            redrawInput();
            // for example on window resize
            window.addEventListener("resize", redrawInput, false);
        });
    }

    var LegendOutput = function(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();

        config.margin.top = 10;
        config.padding.left = 60;
        config.padding.bottom = 0;
        config.margin.bottom = 10;

        config.xParameter = 'Uitkomst';

        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartLegend = ChartLegend(config,svg);

        d3.csv("./dummy_data_output.csv", function(error, data) {

            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);
            chartLegend.drawInputLegend(dimensions, data);

        });
    }

    var Remittances = function Remittances(element) {

        let chartObjects = ChartObjects();
        let config = chartObjects.config();
        let dimensions = chartObjects.dimensions();
        let svg = chartObjects.svg();
        let scales = chartObjects.scales();
        let axes = chartObjects.axes();
        let functions = chartObjects.functions();

        config.margin.top = 0;
        config.margin.bottom = 0;
        config.margin.left = 0;
        config.margin.right = 0;
        config.padding.top = 30;
        config.padding.bottom = 30;
        config.padding.left = 60;
        config.padding.right = 0;
        config.xParameter = 'status';  // name of first column with values of bands on x axis
        config.yParameter = 'totaal';  // is being set in type function
        config.fixedHeight = 160;
        config.minValue = 0;
        config.maxValue = 3000;
        // config.xAlign = [0.5];
        // config.paddingInner = [0.0];

        let chartDimensions = ChartDimensions(element,config);
        dimensions = chartDimensions.get(dimensions);

        // create svg elements without data
        let chartSVG = ChartSVG(element,config,dimensions,svg);
        let chartScales = ChartScales(config,dimensions,scales);
        let chartAxis = ChartAxis(config,svg);

        chartAxis.drawXAxis();
        chartAxis.drawYAxis();

        let chartBar = ChartBar(config,svg,functions);

        d3.csv("./dummy_data_remittances.csv", function(error, csv) {

            function prepareData(csv,filter) {

                let data = [];

                data.push({
                    status: "< €1K",
                    totaal: csv[0][filter] + csv[0][filter]

                });

                data.push({
                    status: "€1K t/m €4K",
                    totaal: csv[1][filter]

                });

                data.push({
                    status: "€4K t/m €10K",
                    totaal: csv[2][filter]

                });

                data.push({
                    status: "> €10K",
                    totaal: csv[3][filter]

                });

                data.columns = csv.columns;

                return data;
            }


            function redraw() {

                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                chartAxis.redrawXBandAxis(dimensions,scales,axes);
                chartAxis.redrawYAxis(scales,axes);
                // redraw data
                chartBar.redraw(dimensions,scales,data);
            }

            let data = prepareData('totaal');

            // with data we can init scales
            scales = chartScales.set(data);
            // width data we can draw items
            chartBar.draw(data);
            // further drawing happens in function that can be repeated.
            redraw();
            // for example on window resize
            window.addEventListener("resize", redraw, false);
        });

    }

    return {
        inputs : Inputs,
        legendInput : LegendInput,
        procedure : Procedure,
        procedureAlt : ProcedureAlt,
        progress : Progress,
        progressCandles : ProgressCandles,
        remitted : Remitted,
        outputs : Outputs,
        legendOutput : LegendOutput,
        remittances : Remittances
    }
}

