let ChartLegend = function ChartLegend(config,svg) {

    let drawInputLegend = function drawInputLegend(dimensions,data) {

        svg.legendTotals = svg.layers.legend
            .attr('transform', 'translate(' + (config.margin.left + config.padding.left) + ',' + (config.margin.top) + ')')

        svg.legendTotals.append("rect")
            .attr('width',8)
            .attr('height',8)
            .attr('y',0);

        svg.legendTotals.append("text")
            .text('Een vierkantje staat voor 100 meldingen')
            .attr('class','')
            .attr('height',18)
            .attr('x',12)
            .attr('y',7);

        svg.legendTotals.selectAll("rect.type")
            .data(data.reverse())
            .enter()
            .append("rect")
            .attr('class', (d,i) => { return 'type ' + d[config.xParameter];  } )
            .attr('width',8)
            .attr('height',8)
            .attr('y', (d,i) => { return i * 22 + 22; });

        svg.legendTotals.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr('class','label')
            .text((d) => { return d[config.xParameter]; })
            .attr('x',16)
            .attr('y', (d,i) => { return i * 22 + 30; })

        ;
    }

    let redrawInputLegend = function redrawInputLegend(dimensions,scales,axes) {


    }



    return {
        drawInputLegend : drawInputLegend,
        redrawInputLegend : redrawInputLegend

    }
}

