let ChartAxis = function ChartAxis(config,svg) {

    let drawXAxis = function drawXAxis() {

        svg.xAxis = svg.layers.axes.append("g")
            .attr('class', 'x-axis');
    }

    let redrawXBandAxis = function redrawXAxis(dimensions,scales,axes) {

        axes.xBand = d3.axisBottom(scales.xBand);

        svg.xAxis
            .attr("transform", "translate(" + config.padding.left + "," + (dimensions.height + config.padding.top) + ")")  //
            .call(axes.xBand);
    }

    let redrawXTimeAxis = function redrawXAxis(dimensions,scales,axes,ticks) {

        axes.xTime = d3.axisBottom(scales.xTime);


        if(ticks) {

            axes.xTime
                .ticks(d3.timeMonth.every(1))
                .tickFormat(d3.timeFormat("%b"));
        } else {

            axes.xTime
                .tickValues([]);
        }

        svg.xAxis
            .attr("transform", "translate(" + config.padding.left + "," + (dimensions.height + config.padding.top) + ")")  //
            .call(axes.xTime);
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

    let redrawYAxisStacked = function redrawYAxisStacked(scales,axes) {

        axes.yLinear = d3.axisLeft(scales.yLinear);

        axes.yLinear
            .ticks(5);

        svg.yAxis
            .call(axes.yLinear);

    }

    let drawInputYAxis = function drawInputYAxis(dimensions) {

        svg.yAxis = svg.layers.axes.append("g")
            .attr('class', 'y-axis')
            .attr("transform", "translate(" + parseInt(config.margin.left + config.padding.left) + "," + parseInt(config.margin.top + config.padding.top) + ")");
    }

    let redrawInputYAxis = function redrawInputYAxis(scales,axes) {

        axes.yInputLinear = d3.axisLeft(scales.yInputLinear);

        axes.yInputLinear
            .ticks(4);

        svg.yAxis
            .call(axes.yInputLinear);

    }

    let drawBlocksYAxis = function drawBlocksYAxis(dimensions) {

        svg.yAxis = svg.layers.axes.append("g")
            .attr('class', 'y-axis')
            .attr("transform", "translate(" + parseInt(config.margin.left + config.padding.left + dimensions.width) + "," + parseInt(config.margin.top + config.padding.top) + ")");
    }

    let redrawBlocksYAxis = function redrawBlocksYAxis(scales,axes) {

        axes.yBlocks = d3.axisRight(scales.yBlocks);

        axes.yBlocks
            .ticks(config.maxValue / 5000);

        svg.yAxis
            .call(axes.yBlocks);

    }

    return {
        drawXAxis : drawXAxis,
        redrawXBandAxis : redrawXBandAxis,
        redrawXTimeAxis : redrawXTimeAxis,
        drawYAxis : drawYAxis,
        redrawYAxis : redrawYAxis,
        drawInputYAxis : drawInputYAxis,
        redrawInputYAxis : redrawInputYAxis,
        redrawYAxisStacked : redrawYAxisStacked,
        drawBlocksYAxis : drawBlocksYAxis,
        redrawBlocksYAxis : redrawBlocksYAxis


    }
}

