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
            containerWidth: 0, // width of element minus config.margin
            width : 0, // containerWidth minus config.padding
            containerHeight: 0, // height of element minus config.margin
            height : 0, // containerHeight minus config.padding

        }

    }

    let svg = function svg(){

        return {
            body : null,
            layers : {},
            yAxis : null,
            yInputAxis : null,
            xAxis : null,
            legendTotals : null,
            area : null,
            line : null,
            candlesUp : null,
            candlesDown : null,
            bar : null,
            series : null,
            input : null,
            blockGroup : null,
            blocks : null // stacked-bars
        }
    }

    let scales = function scales() {

        return {
            xTime : null,
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
        scales : scales,
        axes : axes,
        functions : functions

    }
}


