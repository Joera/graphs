let ChartLegend = function ChartLegend(config,svg) {

    let drawInputLegend = function drawInputLegend(dimensions) {

        svg.legendTotals = svg.layers.legend
            .attr('transform', 'translate(0,' + (parseInt(dimensions.height) - 130) + ')')
            .append("text")
            .attr('class','header')
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

