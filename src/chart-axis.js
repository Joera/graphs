let ChartAxis = function ChartAxis(config,svg) {

    let drawXAxis = function drawXAxis() {

        svg.xAxis = svg.layers.axes.append("g")
            .attr('class', 'time-axis');

    }

    let redrawXAxis = function redrawXAxis(dimensions,scales,axes) {

        axes.xTime = d3.axisBottom(scales.xTime);

        axes.xTime
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat("%b"));

        svg.xAxis
            .attr("transform", "translate(" + 0 + "," + dimensions.height + ")")
            .call(axes.xTime);
    }

    let drawYAxis = function drawYAxis() {

        svg.yAxis = svg.layers.axes.append("g")
            .attr('class', 'total-axis')

    }

    let redrawYAxis = function redrawYAxis(scales,axes) {

        axes.yLinear = d3.axisRight(scales.yLinear);

        axes.yLinear
            .ticks(2);

        svg.yAxis
            .call(axes.yLinear);

    }

    return {
        drawXAxis : drawXAxis,
        redrawXAxis : redrawXAxis,
        drawYAxis : drawYAxis,
        redrawYAxis : redrawYAxis
    }
}

