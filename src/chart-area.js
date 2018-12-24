let ChartArea = function ChartArea(config,svg) {

    let draw = function draw(data){

        svg.area = svg.layers.data.selectAll('.flow')
            .data([data])
            .enter()
            .append("path")
            .attr("fill", "#f6f5f2")
            .attr('class', 'flow');

    }

    let redraw = function redraw(scales,functions){

        functions.area = d3.area()
            .x0((d,i) => { return scales.xTime(new Date(d.date))})
            .x1((d,i) => { return scales.xTime(new Date(d.date))})
            .y0(scales.yLinear(0))
            .y1((d) => {  return scales.yLinear(d[config.yParameter]); });

        svg.area.attr("d", functions.area);

    }

    return {

        draw: draw,
        redraw: redraw
    }

}