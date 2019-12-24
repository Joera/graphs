let globalData = {};

let ChartObjects = function ChartObjects() {

    let config = function config() {

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
    }

    let dimensions = function dimensions() {

        return {
            svgWidth: 0, // width of element minus config.margin
            width : 0, // svgWidth minus config.padding
            svgHeight: 0, // height of element minus config.margin
            height : 0, // svgHeight minus config.padding
        }

    }

    let svg = function svg(){

        return {
            body : null,
            layers : {},
            tooltip : (document.querySelector('.tooltip')) ? document.querySelector('.tooltip') : d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0),
            yAxis : null,
            xAxis : null
        }
    }

    let xScale = function xScale() {

        return {
            xTime : null,
        }
    }

    let yScale = function yScale() {

        return {
            yLinear: null,
            yLinearInput: null,
            yInputLinearReverse: null
        }
    }

    let axes = function axis() {

        return {
            xTime : null,
            xBand : null,
            yLinear : null,
            yInputLinear : null
        }

    }

    let functions = function functions() {

        return {
            area: null,
            line: null,
            stack: null,
        }

    }

    return {
        config : config,
        dimensions : dimensions,
        svg : svg,
        xScale : xScale,
        yScale : yScale,
        axes : axes,
        functions : functions

    }
}


