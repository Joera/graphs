let ChartLegend = function ChartLegend(config,svg) {

    let drawInputLegend = function drawInputLegend(dimensions,data) {

        svg.legendTotals = svg.layers.legend
            .attr('transform', 'translate(25,' + (parseInt(dimensions.height) - 130) + ')')
            .append("text")
            .attr('class','header')
            .text('Totaal dossiers');


        svg.legendTotals.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('class', (d,i) => {  console.log(d); return d.provenance;  } )
            .attr('width',8)
            .attr('height',8)
            .attr('y', (d,i) => { return i * 10; })


        ;
    }

    let redrawInputLegend = function redrawInputLegend(dimensions,scales,axes) {


    }



    return {
        drawInputLegend : drawInputLegend,
        redrawInputLegend : redrawInputLegend

    }
}

