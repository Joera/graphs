let ChartAxis = function ChartAxis(config,svg) {

    let drawXAxis = function drawXAxis() {

        svg.xAxis = svg.layers.axes.append("g")
            .attr('class', 'x-axis');
    }

    let redrawXBandAxis = function redrawXAxis(dimensions,xScale,axes,alternateTicks,smallMultiple) {

        axes.xBand = d3.axisBottom(xScale.band);

        axes.xBand
            .tickFormat( (d,i) => {
                return (window.innerWidth < 640 || smallMultiple) ? (i + 1) : d;
            });

        svg.xAxis
            .attr("transform", "translate(" + config.margin.left + "," + (dimensions.height + config.padding.top) + ")")  //
            .call(axes.xBand);

        if (alternateTicks) {

            let alternate_text = false;
            if(window.innerWidth > 640 && (!smallMultiple || smallMultiple === undefined)) {

                d3.selectAll("g.x-axis g.tick text")
                    .attr("y", function () {
                        if (alternate_text) {
                            alternate_text = false;
                            return 26;
                        } else {
                            alternate_text = true;
                            return 10;
                        }
                    });
            }
        }
    }

    let redrawXTimeAxis = function redrawXAxis(dimensions,scales,axes,ticks) {

        axes.xTime = d3.axisBottom(scales.time);

        if(ticks) {
            axes.xTime
                .ticks(d3.timeMonth.every(1))
                .tickFormat(function(date){
                    return (d3.timeYear(date) < date) ? localTime.format('%b')(date) : localTime.format('%Y')(date);
                });
        } else {
            axes.xTime
                .tickValues([]);
        }

        svg.xAxis
            .attr("transform", "translate(" + config.margin.left + "," + (dimensions.height + config.padding.top) + ")")  //
            .call(axes.xTime);
    }

    let drawYAxis = function drawYAxis() {

        svg.yAxis = svg.layers.axes.append("g")
            .attr('class', 'y-axis')
            .attr("transform", "translate(" + parseInt(config.margin.left) + "," + (config.margin.top + config.padding.top) + ")");
    }

    let redrawYAxis = function redrawYAxis(yScale,axes) {

        axes.yLinear = d3.axisLeft(yScale.linear);

        if(config.noTicksYAxis) {
            axes.yLinear
                .tickValues([]);
        } else {
            axes.yLinear
                .ticks(5);
        }

        if(config.currencyLabels ) {
            axes.yLinear
                .tickFormat(function(d){
                    return shortenCurrency(convertToCurrency(d));
                });
        }

        svg.yAxis
            .call(axes.yLinear);

    }

    let redrawYAxisStacked = function redrawYAxisStacked(scales,axes) {

        console.log('fff');

        axes.yLinear = d3.axisLeft(scales.stacked);

        if(config.noTicksYAxis) {
            axes.yLinear
                .tickValues([]);
        } else {
            axes.yLinear
                .ticks(5);
        }

        svg.yAxis
            .call(axes.yLinear);

    }

    return {
        drawXAxis : drawXAxis,
        redrawXBandAxis : redrawXBandAxis,
        redrawXTimeAxis : redrawXTimeAxis,
        drawYAxis : drawYAxis,
        redrawYAxis : redrawYAxis,
        // drawInputYAxis : drawInputYAxis,
        // redrawInputYAxis : redrawInputYAxis,
        redrawYAxisStacked : redrawYAxisStacked,
    }
}

