let ChartStackedArea = function ChartStackedArea(config,svg,functions) {


    let prevArea = false;

    let init = function draw(stackedData) {

        svg.series = svg.layers.data.selectAll(".stackedGroup")
            .data(stackedData);

        svg.series.exit().remove();

        svg.seriesEnter = svg.series
            .enter().append("g")
            .attr("class", (d) => {
                return "stackGroup";
            });

    }

    let draw = function draw(data,stackedData) {

        svg.areas = svg.series.merge(svg.seriesEnter).selectAll(".flow")
            .data(function(d) { return stackedData; });

        svg.areas.exit().remove();

        svg.areasEnter = svg.areas
            .enter()
            .append("path")
            .attr('class', (d,i) => {
                return 'flow ';
            })
        ;
    }

    let redraw = function redraw(dimensions,xScale,yScale,dataMapping) {

        let newArea = d3.area()
            .x(function(d) { return xScale.time(new Date(d.data._date)); })
            .y0(function(d) { return config.padding.top + yScale.stacked(d[0]); })
            .y1(function(d) { return config.padding.top + yScale.stacked(d[0]); });

        let area = d3.area()
             .x(function(d) { return xScale.time(new Date(d.data._date)); })
            .y0(function(d) { return config.padding.top +  yScale.stacked(d[0]); })
            .y1(function(d) { return config.padding.top + yScale.stacked(d[1]); });

        prevArea = area;

        // new areas
        svg.areasEnter
            .merge(svg.areas)
            .attr('d', newArea)
            .transition()
            .delay(200)
            .duration(200)
            .attr('d', area)
            .style('fill', (d) => {
                return dataMapping.find( (map) => { return map.column === d.key})['colour'];
            });
    }

    return  {
        init : init,
        draw : draw,
        redraw : redraw
    }

}
