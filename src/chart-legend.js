let ChartLegend = function ChartLegend(config,svg) {

    let drawtotalsLegends = function drawtotalsLegends() {

        svg.legendTotals = svg.layers.axes.append("g")
            .attr('class', 'legend totals');
    }

    let redrawtotalsLegends = function redrawtotalsLegends(dimensions,scales,axes) {

        axes.xBand = d3.axisBottom(scales.xBand);

        // axes.xBand
            // .ticks(d3.timeMonth.every(1))
            // .tickFormat(d3.timeFormat("%b"));

        svg.xAxis
            .attr("transform", "translate(" + 0 + "," + dimensions.height + ")")
            .call(axes.xBand);
    }



    return {
        drawtotalsLegends : drawtotalsLegends,
        redrawtotalsLegends : redrawtotalsLegends

    }
}

