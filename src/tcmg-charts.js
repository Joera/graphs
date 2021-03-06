'use strict';

let globalData;


var TCMGCharts = function TCMGCharts() {

    // init multiple charts from this file

    let procedureSelect = document.getElementById("select-municipality");





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
        // config.minWidth = 460;
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



    var ProgressCandles = function(element) {


    }




    // var LegendOutput = function(element) {
    //
    //     let chartObjects = ChartObjects();
    //     let config = chartObjects.config();
    //     let dimensions = chartObjects.dimensions();
    //     let svg = chartObjects.svg();
    //
    //     config.margin.top = 10;
    //     config.padding.left = 60;
    //     config.padding.bottom = 0;
    //     config.margin.bottom = 10;
    //
    //     config.xParameter = 'Uitkomst';
    //
    //     let chartDimensions = ChartDimensions(element,config);
    //     dimensions = chartDimensions.get(dimensions);
    //
    //     let chartSVG = ChartSVG(element,config,dimensions,svg);
    //     let chartLegend = ChartLegend(config,svg);
    //
    //     d3.csv("./dummy_data_output.csv", function(error, data) {
    //
    //         dimensions = chartDimensions.get(dimensions);
    //         chartSVG.redraw(dimensions);
    //         chartLegend.drawInputLegend(dimensions, data);
    //
    //     });
    // }






    //     var setMunicipalitySelect = function setMunicipalitySelect(municipality) {
    //
    //         procedureSelect.value = municipality;
    //
    //         let event = document.createEvent("HTMLEvents");
    //         event.initEvent("change",true,false);
    //         procedureSelect.dispatchEvent(event);
    //
    // }

    return {

        procedure : Procedure,
        procedureAlt : ProcedureAlt,
        // progressCandles : ProgressCandles,

    }
}

