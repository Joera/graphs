let ChartLegend = function ChartLegend(config,svg) {

    let drawInputLegend = function drawInputLegend(dimensions,data) {

        svg.legendTotals = svg.layers.legend
            .attr('transform', 'translate(25,' + (parseInt(dimensions.height) - 130) + ')')

        svg.legendTotals.append("text")
            .attr('class','header')
            .text('Totaal dossiers');


        svg.legendTotals.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('class', (d,i) => {  console.log(d); return d.provenance;  } )
            .attr('width',8)
            .attr('height',8)
            .attr('y', (d,i) => { return i * 16 + 10; });

        svg.legendTotals.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr('class','label')
            .text((d,i) => { return '100x ' + d.provenance; })
            .attr('x',12)
            .attr('y', (d,i) => { return i * 16 + 10; })


        ;
    }

    let redrawInputLegend = function redrawInputLegend(dimensions,scales,axes) {


    }



    return {
        drawInputLegend : drawInputLegend,
        redrawInputLegend : redrawInputLegend

    }
}

