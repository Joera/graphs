let ChartLegend = function ChartLegend(config,svg) {

    let drawtotalsLegends = function drawtotalsLegends() {

        svg.legendTotals = svg.layers.legend
            .attr('transform', 'translate(60,' + config.height + ')')
            .append("text")
            .text('Totaal dossiers')

        ;
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

