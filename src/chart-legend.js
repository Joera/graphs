let ChartLegend = function ChartLegend(config,svg) {

    let drawInputLegend = function drawInputLegend(dimensions) {

        svg.legendTotals = svg.layers.legend
            .attr('transform', 'translate(60,' + (parseInt(dimensions.height) - 140) + ')')
            .append("text")
            .text('Totaal dossiers')

        ;
    }

    let redrawInputLegend = function redrawInputLegend(dimensions,scales,axes) {


    }



    return {
        drawInputLegend : drawInputLegend,
        redrawInputLegend : redrawInputLegend

    }
}

