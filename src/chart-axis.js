let ChartAxis = function ChartAxis(config,svg) {

    let drawXAxis = function drawXAxis() {

        svg.xAxis = svg.layers.axes.append("g")
            .attr('class', 'x-axis');
    }

    let redrawXAxis = function redrawXAxis(dimensions,scales,axes) {

        axes.xBand = d3.axisBottom(scales.xBand);

        // axes.xBand
            // .ticks(d3.timeMonth.every(1))
            // .tickFormat(d3.timeFormat("%b"));

        svg.xAxis
            .attr("transform", "translate(" + 0 + "," + (dimensions.height - config.margin.top - config.padding.top) + ")")
            .call(axes.xBand);
    }

    let drawYAxis = function drawYAxis() {

        svg.yAxis = svg.layers.axes.append("g")
            .attr('class', 'y-axis')
            .attr("transform", "translate(" + parseInt(config.margin.left + config.padding.left) + "," + (config.margin.top + config.padding.top) + ")");
    }

    let redrawYAxis = function redrawYAxis(scales,axes) {

        axes.yLinear = d3.axisLeft(scales.yLinear);

        axes.yLinear
            .ticks(5);

        svg.yAxis
            .call(axes.yLinear);

    }

    let drawInputYAxis = function drawInputYAxis(dimensions) {

        svg.yInputAxis = svg.layers.axes.append("g")
            .attr('class', 'y-axis')
            .attr("transform", "translate(" + parseInt(config.margin.left + config.padding.left) + "," + parseInt(config.margin.top + config.padding.top) + ")");
    }

    let redrawInputYAxis = function redrawInputYAxis(scales,axes) {

        axes.yInputLinear = d3.axisLeft(scales.yInputLinear);

        axes.yInputLinear
            .ticks(4);

        svg.yInputAxis
            .call(axes.yInputLinear);

    }

    return {
        drawXAxis : drawXAxis,
        redrawXAxis : redrawXAxis,
        drawYAxis : drawYAxis,
        redrawYAxis : redrawYAxis,
        drawInputYAxis : drawInputYAxis,
        redrawInputYAxis : redrawInputYAxis

    }
}

