let ChartLine = function ChartLine(config,svg,dimensions) {


    // let popup = function popup(d) {
    //
    //     return moment(d[config.xParameter]).subtract(1, 'week').format('D/MM') + ' - '
    //         + moment(d[config.xParameter]).format('D/MM') + '<br/>'
    //         + d['nieuwe_schademeldingen'] + ' Nieuwe schademeldingen' + '<br/>'
    //         + d['nieuwe_afgehandeld'] + ' Deze week afgehandeld';
    // }

    let draw = function draw(data) {

        svg.line = svg.layers.data.selectAll('path')
            .data([data]);

        svg.line.exit().remove();

        svg.lineEnter = svg.line
            .enter()
            .append("path")
            .attr("class", "line");
    }

    let redraw = function redraw(xScale,yScale,functions) {


        functions.line = d3.line()
            .x( (d) =>{ return xScale.time(new Date(d[config.xParameter])); }) //  / * ;  */
            .y( (d) => { return yScale.linear(d[config.yParameter]); })
            .curve(d3.curveStep);

        svg.line
            .merge(svg.lineEnter)
            .attr("d", functions.line)
            .attr("fill","none")
            .attr("stroke", orange )
            .attr("stroke-width",4)
            ;

    }

    return {
        draw: draw,
        redraw: redraw
    }
}
