let ChartLegend = function ChartLegend(config,svg) {

    let drawInputLegend = function drawInputLegend(dimensions,data) {

        svg.legendTotals = svg.layers.legend
            .attr('transform', 'translate(63,' + (parseInt(config.margin.top) + 10) + ')')

        svg.legendTotals.append("rect")
            .attr('width',8)
            .attr('height',8);

        svg.legendTotals.append("text")
            .text('Een vierkantje staat voor 100 meldingen')
            .attr('class','')
            .attr('height',18)
            .attr('x',12);

        svg.legendTotals.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('class', (d,i) => { return d.provenance;  } )
            .attr('width',8)
            .attr('height',8)
            .attr('y', (d,i) => { return i * 16 + 10; });

        svg.legendTotals.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr('class','label')
            .text((d) => { return d.provenance; })
            .attr('x',12)
            .attr('y', (d,i) => { return i * 16 + 18; })

        ;
    }

    let redrawInputLegend = function redrawInputLegend(dimensions,scales,axes) {


    }



    return {
        drawInputLegend : drawInputLegend,
        redrawInputLegend : redrawInputLegend

    }
}

