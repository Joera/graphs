let ChartLegend = function ChartLegend(config,svg) {

    let drawInputLegend = function drawInputLegend(dimensions) {

        svg.legendTotals = svg.layers.legend
            .attr('transform', 'translate(60,' + dimensions.height + ')')
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
            .attr("transform", "translate(" + 0 + "," + dimensions.height - 200 + ")")
            .call(axes.xBand);
    }



    return {
        drawInputLegend : drawInputLegend,
        redrawtotalsLegends : redrawtotalsLegends

    }
}

